#!/usr/bin/env ruby

### Here are 'alb' CF stack creation notes:
# - CF stack needs to be created in AWS region and per each Universe which {Elasticsearch DB} is to be deployed to
# - CF stack naming convention: {Universe}-{SERVICE}-es
# - create the stack with --enable-termination-protection parameter or enable Termination Protection manually via Console

require 'bundler/setup'
require 'cloudformation-ruby-dsl/cfntemplate'

template do

  value :AWSTemplateFormatVersion => '2010-09-09'

  value :Description => 'Firebird SWAT Observability Logger.'

  ###################################################################################################################
  # Parameters
  ###################################################################################################################

  parameter 'VPC',
            :Description           => 'VPC to Launch the ECS Cluster',
            :Type                  => 'String',
            :Default               => 'qa',
            :AllowedValues         => %w(qa prod),
            :ConstraintDescription => 'Must be a valid VPC.',
            :Immutable             => true



  ###################################################################################################################
  # Mappings
  ###################################################################################################################


  ###################################################################################################################
  # CONSTANTS
  ###################################################################################################################

  VPC                 = parameters['VPC']
  SERVICE             = 'firebird-analytics'
  TEAM_EMAIL          = 'firebird-devs@bazaarvoice.com'
  LB_SCHEME           = 'external'
  LB_NAME             = "#{VPC}-fb-analytics-alb"
  IDLE_TIMEOUT        = 60


  ###################################################################################################################
  # Resources
  ###################################################################################################################


  resource 'EcsCluster', :Type => 'AWS::ECS::Cluster', :Properties => {
    :CapacityProviders => [
        'FARGATE',
        'FARGATE_SPOT',
    ],
    :ClusterName => "#{SERVICE}-#{VPC}",
    :DefaultCapacityProviderStrategy => [
        {
            :CapacityProvider => 'FARGATE',
            :Weight => 1,
        },
    ],
}


resource 'NexusVpc', :Type => 'Custom::NexusVpc', :Version => '1.0', :Properties => {
    :ServiceToken => join(':', 'arn:aws:lambda', aws_region, aws_account_id, 'function:CommonCfnResource'),
}

resource 'NexusSecurityGroups', :Type => 'Custom::NexusSecurityGroups', :Version => '1.0', :Properties => {
    :ServiceToken => join(':', 'arn:aws:lambda', aws_region, aws_account_id, 'function:CommonCfnResource'),
}

resource 'VpcDotBvComCertificate', :Type => 'Custom::CertificateInfo', :Version => '1.0', :Properties => {
    :ServiceToken => join(':', 'arn:aws:lambda', aws_region, aws_account_id, 'function:CommonCfnResource'),
    :Domain       => "*.#{VPC}.bazaarvoice.com"
}


resource 'LoadBalancer', :Type => 'AWS::ElasticLoadBalancingV2::LoadBalancer', :Properties => {
    :Name          => LB_NAME,
    :Scheme        => 'internet-facing',
    :Type          => 'application',
    :LoadBalancerAttributes => [
        {
            :Key   => 'deletion_protection.enabled',
            :Value => true
        },
        {
            :Key   => 'idle_timeout.timeout_seconds',
            :Value => IDLE_TIMEOUT
        },
    ],
    :Subnets       => (get_att('NexusVpc', 'PublicSubnetIds')),

    ########## IMPORTANT NOTE REGARDING SECURITY GROUPS!!!!
    ## The following limits exist in AWS (some of them can be increased via AWS Support):
    ### The maximum number of IPv4 inbound security group rules that can be applied to a network interface is 1000. (f1)
    ### The current maximum number of Security Groups that can be attached to a network interface is 10.            (f2)
    ### The current maximum number of rules per VPC security group is 100.                                          (f2)
    ## (f1): https://docs.aws.amazon.com/vpc/latest/userguide/amazon-vpc-limits.html#vpc-limits-security-groups
    ## (f2): https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#Limits:
    ##########
    :SecurityGroups => [ get_att('NexusSecurityGroups', 'PublicWebPortsId') ],
    :Tags           => [
        {
            :Key   => 'metrics',
            :Value => 'enabled'
        },
        {
            :Key   => 'ELBScheme',
            :Value => LB_SCHEME,
        },
    ]
}


resource 'ListenerHTTP', :Type  => 'AWS::ElasticLoadBalancingV2::Listener', :Properties => {
    :DefaultActions             => [
        {
            :RedirectConfig     => {
                :Protocol   => 'HTTPS',
                :Port       => 443,
                :Host       => '#{host}',
                :Path       => '/#{path}',
                :Query      => '#{query}',
                :StatusCode => 'HTTP_301'
            },
            :Type               => 'redirect'
        }
    ],
    :LoadBalancerArn            => ref('LoadBalancer'),
    :Port                       => '80',
    :Protocol                   => 'HTTP'
}

resource 'ListenerHTTPS', :Type => 'AWS::ElasticLoadBalancingV2::Listener', :Properties => {
    :Certificates               => [
        {
            :CertificateArn     => get_att('VpcDotBvComCertificate', 'Arn'),
        }
    ],
    :DefaultActions             => [
        {
            :TargetGroupArn     => ref('TargetGroup'),
            :Type               => 'forward'
        }
    ],
    :LoadBalancerArn            => ref('LoadBalancer'),
    :Port                       => '443',
    :Protocol                   => 'HTTPS'
}


resource 'TargetGroup', :Type   => 'AWS::ElasticLoadBalancingV2::TargetGroup', :Properties => {
    :Name                       => get_att('LoadBalancer', 'LoadBalancerName'),
    :Port                       => '8080',
    :Protocol                   => 'HTTP',
    :TargetType                 => 'ip',
    :HealthCheckIntervalSeconds => 15,
    :HealthCheckTimeoutSeconds  => 14,
    :HealthyThresholdCount      => 2,
    :UnhealthyThresholdCount    => 2,
    :HealthCheckPath            => '/insight',
    :HealthCheckPort            => '8080',
    :HealthCheckProtocol        => 'HTTP',
    :Matcher                    => {:HttpCode => '200'},
    :VpcId                      => get_att('NexusVpc', 'VpcId'),
    :TargetGroupAttributes      => [
        {
            :Key                => 'deregistration_delay.timeout_seconds',
            :Value              => 300
        },
        {
            :Key                => 'slow_start.duration_seconds',
            :Value              => 60
        }
    ],
    :Tags                       => [
        {
            :Key                => 'metrics',
            :Value              => 'enabled'
        },
    ],
}


  

  ###################################################################################################################
  # Outputs
  ###################################################################################################################



# NOTE: this is required to allow an application-level CFN template to find the TargetGroup resource for the ALB
output 'LoadBalancerTargetGroup',
  :Description => 'Logical ID of the ALB Target Group',
  :Value       => ref('TargetGroup'),
  :Export      => { :Name => "#{LB_NAME}-LoadBalancerTargetGroup" }



  ###################################################################################################################
  # Tags
  ###################################################################################################################
  # The CF tag type is a DSL extension; it is not a property of actual CloudFormation templates.
  # These tags are excised from the template and used to generate a series of --tag arguments which are passed to
  # CloudFormation when a stack is created or updated. The tags are propagated to all resources of the stack,
  # including the stack itself. Doesn't overwrite own resource's tags with the same name.
  ###################################################################################################################

  tag 'bv:nexus:vpc',
      :Value => VPC

  tag 'bv:nexus:team',
      :Value => TEAM_EMAIL

  tag 'bv:nexus:service',
      :Value => SERVICE

  tag 'Universe',
      :Value => VPC


#  The following tag needs to be updated based on Sentry standards.
#  tag 'bv:system',
#      :Value => 'firebird'

end.exec!