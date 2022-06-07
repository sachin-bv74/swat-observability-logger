#!/usr/bin/env ruby

require 'bundler/setup'
require 'cloudformation-ruby-dsl/cfntemplate'

template do

  value :AWSTemplateFormatVersion => '2010-09-09'

  value :Description => 'ECS Service for SWAT observability logger'

   ###################################################################################################################
  # Parameters
  ###################################################################################################################

  parameter 'VPC',
            :Description           => 'The VPC to deploy the app in.',
            :Type                  => 'String',
            :Default               => 'qa',
            :AllowedValues         => %w(qa prod),
            :ConstraintDescription => 'Must be a valid vpc.',
            :Immutable             => true


  parameter 'Version',
            :Description           => 'The version of application to Install.',
            :Type                  => 'String',
            :Default               => 'latest'
            

  ###################################################################################################################
  # Mappings
  ###################################################################################################################

  mapping 'UniverseMap',
          :qa   => { :MIN => 1, :DESIRED => 1, :MAX => 2 },
          :prod => { :MIN => 1, :DESIRED => 1, :MAX => 3}

          
  ###################################################################################################################
  # CONSTANTS
  ###################################################################################################################

  VERSION       = parameters['Version']
  VPC           = parameters['VPC']
  SERVICE       = 'firebird-analytics'
  TEAM_EMAIL    = 'firebird-devs@bazaarvoice.com'
  ROLE          = 'app'
  TIMESTAMP = Time.new.strftime("%Y%m%dt%H%M")
  

  ###################################################################################################################
  # Resources
  ###################################################################################################################

  resource 'NexusVpc', :Type => 'Custom::NexusVpc', :Version => '1.0', :Properties =>{
    :ServiceToken => join(':', 'arn:aws:lambda', aws_region, aws_account_id, 'function:CommonCfnResource'),
}
  resource 'NexusSecurityGroups', :Type => 'Custom::NexusSecurityGroups', :Version => '1.0', :Properties => {
    :ServiceToken => join(':', 'arn:aws:lambda', aws_region, aws_account_id, 'function:CommonCfnResource'),
}


  resource 'TaskDefinition', :Type => 'AWS::ECS::TaskDefinition', :Properties => {
      :Family => SERVICE,
      :RequiresCompatibilities => [ 'FARGATE' ],
      :ExecutionRoleArn => join('',"arn:aws:iam::",aws_account_id,":role/ecsTaskExecutionRole"),
      :Cpu => 1024,
      :Memory => 2048,
      :NetworkMode => 'awsvpc',
      :ContainerDefinitions => [
          {
              :Name => SERVICE,
              :Image => "549050352176.dkr.ecr.us-east-1.amazonaws.com/swat-observability-logger:#{VERSION}",
              :PortMappings => [
                  {
                      :ContainerPort => 8080,
                      :Protocol => 'tcp',
                  },
              ],
              :LogConfiguration => {
                :logDriver => "awslogs",
                :options   => {
                    :"awslogs-group"        => "/ecs/#{SERVICE}",
                    :"awslogs-region"       => aws_region,
                    #:"awslogs-create-group" => "true",
                    :"awslogs-stream-prefix" => "ecs"

                },
              },
          },
      ],
  }

  resource 'Service', :Type => 'AWS::ECS::Service',:Properties => {
      :LaunchType => 'FARGATE',
      :Cluster => "#{SERVICE}-#{VPC}",
      :DesiredCount => find_in_map('UniverseMap', VPC, 'DESIRED'),
      :TaskDefinition => ref('TaskDefinition'),
      :PropagateTags => 'SERVICE',
      :DeploymentConfiguration => {
          :MaximumPercent => 200,
          :MinimumHealthyPercent => 100,
          :DeploymentCircuitBreaker => {
            :Enable => true,
            :Rollback => true,
          }
      },
      :NetworkConfiguration => {
          :AwsvpcConfiguration => {
              :AssignPublicIp => 'DISABLED',
              :SecurityGroups => [ get_att('NexusSecurityGroups', 'InternalTrafficId') ],
              :Subnets => get_att('NexusVpc', 'PrivateSubnetIds') ,
          },
      },
   :LoadBalancers => 
   [ 
       {
           :TargetGroupArn => {"Fn::ImportValue": "#{VPC}-fb-analytics-alb-LoadBalancerTargetGroup"},
           :ContainerPort => 8080,
           :ContainerName => SERVICE,
       },
    ],
  }

  resource 'AutoScalingRole', :Type => 'AWS::IAM::Role', :Properties => {
    :RoleName => join('', SERVICE, 'AutoScalingRole'),
    :AssumeRolePolicyDocument => {
        :Statement => [
            {
                :Effect => 'Allow',
                :Principal => { :Service => 'ecs-tasks.amazonaws.com' },
                :Action => 'sts:AssumeRole',
            },
        ],
    },
    :ManagedPolicyArns => [ 'arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceAutoscaleRole' ],
}

  resource 'AutoScalingTarget', :Type => 'AWS::ApplicationAutoScaling::ScalableTarget', :Properties => {
    :MinCapacity => find_in_map('UniverseMap', VPC, 'MIN'),
    :MaxCapacity => find_in_map('UniverseMap', VPC, 'MAX'),
    :ResourceId => join('/', 'service', "#{SERVICE}-#{VPC}", get_att('Service', 'Name')),
    :ScalableDimension => 'ecs:service:DesiredCount',
    :ServiceNamespace => 'ecs',
    :RoleARN => get_att('AutoScalingRole', 'Arn'),
}

resource 'AutoScalingPolicy', :Type => 'AWS::ApplicationAutoScaling::ScalingPolicy', :Properties => {
    :PolicyName => join('-', "#{SERVICE}", 'AutoScalingPolicy'),
    :PolicyType => 'TargetTrackingScaling',
    :ScalingTargetId => ref('AutoScalingTarget'),
    :TargetTrackingScalingPolicyConfiguration => {
        :PredefinedMetricSpecification => { :PredefinedMetricType => 'ECSServiceAverageCPUUtilization' },
        :ScaleInCooldown => 120,
        :ScaleOutCooldown => 120,
        :TargetValue => 65,
    },
}

  tag 'bv:nexus:vpc',        :Value => VPC
  tag 'bv:nexus:service',    :Value => SERVICE
  tag 'bv:nexus:role',       :Value => ROLE
  tag 'bv:nexus:team',       :Value => TEAM_EMAIL
  tag 'env',                 :Value => VPC
  tag 'bv:nexus:owner',      :Value => TEAM_EMAIL
  tag 'bv:nexus:datatype',   :Value => 'none'
  tag 'bv:nexus:env',        :Value => VPC
  tag 'bv:nexus:costcenter', :Value => TEAM_EMAIL
  tag 'bv:nexus:access',     :Value => 'none'
  tag 'creationTime',        :Value => TIMESTAMP

end.exec!