const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
const OPERATING_SYSTEM_LABELS = require("./utils/constants").OPERATING_SYSTEM_LABELS;
const INTERRUPT_TYPE = require("./utils/constants").INTERRUPT_TYPE;
const logger = require("console");
const { exit } = require("process");

module.exports = async function(port, signal = "SIGKILL", isHealthCheckOnly) {

    port = Number.parseInt(port);
    if(isNaN(port)){
        logger.error("Please pass a valid port number");
        exit(0);
    }

    if(!OPERATING_SYSTEM_LABELS.includes(process.platform)){
        logger.error("Currently not supporting that OS");
        exit(0);
    }

    /**
     * Check if valid signal value is passed by User
     */
    if(signal && !Object.keys(INTERRUPT_TYPE).includes(signal)){
        logger.error("Invalid Signal, please refer documentation");
        exit(0);
    }
    
    if(isHealthCheckOnly){
        try {
            logger.info(Number.parseInt(await (await exec(`lsof -i :${port}`)).stdout));
            logger.error("Health Status: 👍🏼");            
        } catch (error) {
            logger.error("Health Status: 👎🏼");
        }
        return 0;
    }

    /** 
     * To kill the process by port, get processId(pId) 
     */
    let processId;
    try {
        processId =  await (await exec(`lsof -i :${port} -t`)).stdout;
        processId = Number.parseInt(processId);
    } catch(error) {
        logger.error(`No process running on port: ${port}`);
        exit(0);
    }

    /**
     * Killing the process by processId 
     */
    
    try {
        exec(`kill -${INTERRUPT_TYPE[signal]} ${processId}`);            
        confirmationLogs(processId, port);   
    } catch (error) {
        logger.error(`Port Killing process Interrupted... Raise the <a href="https://github.com/shravan20/port-killer/issues">issue</a>`);        
        exit(0);
    }
}

function confirmationLogs(processId, port) {
    logger.table({
        processId: processId,
        portNumber: port
    });
    logger.info("Process killed successfully in 127.0.0.1");
    logger.info(`Port ${port} will not be accessible on your 127.0.0.1`);
}
