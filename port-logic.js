const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
const OPERATING_SYSTEM_LABELS = require("./utils/constants").OPERATING_SYSTEM_LABELS;
const INTERRUPT_TYPE = require("./utils/constants").INTERRUPT_TYPE;
const logger = require("console");

module.exports = async function(port) {

    if(isNaN(port)){
        throw new Error("Please pass a valid port number");
    }

    if(!OPERATING_SYSTEM_LABELS.includes(process.platform)){
        throw new Error("Currently not supporting that OS");
    }
    let signal = "SIGKILL";

    if(signal && !Object.keys(INTERRUPT_TYPE).includes(signal)){
        throw new Error("Invalid Signal, please refer documentation");
    }
    
    /** 
     * To kill the process by port, get processId(pId) 
     */
    let processId =  await (await exec(`lsof -i :${port} -t`)).stdout;
    processId = Number.parseInt(processId);
    
    /**
     * Killing the process by processId 
     */
    try {
        exec(`kill -${signal} ${processId}`);            
        confirmationLogs(processId, port);   
    } catch (error) {
        throw new Error(`Port Killing process Interrupted... Raise the <a href="https://github.com/shravan20/port-killer/issues">issue</a>`);        
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
