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
  

readline.question("Enter the port number(mandatory):", port => {
    if(!port){ 
        logger.error("Empty Port is not allowed");
        exit(0);
    }

    logger.log("\Below are available Interrupt Types(if you do not know, leave it empty/click Enter) : ")
    logger.table(Object.keys(INTERRUPTS));

    readline.question("\nEnter the signal(optional):", signalOption => {
        readline.close();
        signalOption = Number.parseInt(signalOption);
     
        if(signalOption && isNaN(signalOption) && signalOption>Object.keys(INTERRUPTS).length){
            logger.error("Invalid option");
            exit(0);
        }
        
        let signal;
        signal = INTERRUPTS[signalOption];

        signal && app(port,signal);
        !signal && app(port);
    });
});

