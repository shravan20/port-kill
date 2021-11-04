const app = require("./port-logic.js");
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

    readline.question("Enter the signal(optional):", signal => {
        readline.close();
        signal && app(port,signal);
        !signal && app(port);
    });
});

