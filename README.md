# swat-observability-logger
  
# Running Datadog-agent
1. Install agent via terminal using below command. Get the <BV_API_KEY> from Bazaarvoice Datadog integration page.
   ```
   DD_AGENT_MAJOR_VERSION=7 DD_API_KEY="<BV_API_KEY>" DD_SITE="datadoghq.com" bash -c "$(curl -L https://s3.amazonaws.com/dd-agent/scripts/install_mac_os.sh)"
   ```
   
3. Commands to start, stop and check status of the agent
    ```
    launchctl stop com.datadoghq.agent
    launchctl start com.datadoghq.agent
    datadog-agent status
    ```
        
4. Modify **~/.datadog-agent/datadog.yaml** file with DD BV_API_KEY, agent's global configurations.
5. Create a directory **/nodejs.d/conf.yaml** under **~/.datadog-agent/conf.d/** to add configuration specific to our log file (app.log for this application)
6. /nodejs.d/conf.yaml would look like below
   ``` 
    ##Log section
    logs:
    - type: file
      path: "/Users/varsha.adiga/Documents/work/swat-observability-logger/logs/app.log"
      service: NodeErrorLogger
      source: nodejs
      sourcecategory: sourcecode
      start_position: beginning
      auto_multi_line_detection: true
   ```
   # Datadog Dashboards
   ```
      https://app.datadoghq.com/dashboard/wx2-ikx-c63?from_ts=1645678526608&to_ts=1646283326608&live=true
   ```
