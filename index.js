#!/usr/bin/env node

const app = require("./port-logic");
const INTERRUPTS = require("./utils/constants").INTERRUPT_TYPE;
const logger = require("console");
const { exit } = require("process");
/**
 * To create CLI interface
 */
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  
readline.question("Enter the port number(mandatory):", async (port) => {
    let healthCheckOnly = false;
    if(!port){ 
        logger.error("Empty Port is not allowed");
        exit(0);
    }

    let arguments = process.argv;

    if(arguments.length>2) {
        if(arguments[2] == "--health"){
            healthCheckOnly = true;
        }
    }

    if(healthCheckOnly){
        await app(port,null,healthCheckOnly);
        exit(0);
    }

    logger.log("\Below are available Interrupt Types(if you do not know, leave it empty/click Enter) : ")
    logger.table(Object.keys(INTERRUPTS));

    readline.question("\nEnter the signal(optional):", signalOption => {
        readline.close();
        signalOption = Number.parseInt(signalOption);
 
        /**
         * Check if selected signal option are valid
         */
        checkSignalOption(signalOption);
        
        let signal;
        signal = INTERRUPTS[signalOption];

        signal && app(port,signal);
        !signal && app(port);
    });
});


function checkSignalOption(signalOption) {
    if (signalOption && isNaN(signalOption)) {
        logger.error("Invalid option");
        exit(0);
    }

    if (signalOption && (signalOption < 0 || (signalOption > (Object.keys(INTERRUPTS).length - 1)))) {
        logger.error(`Selected option not in range(0-${Object.keys(INTERRUPTS).length - 1}) => index values as shown in above table`);
        exit(0);
    }
}

