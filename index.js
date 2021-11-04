const app = require("./port-logic");
const logger = require("console");
/**
 * To create CLI interface
 */
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  

readline.question("Enter the port number(mandatory)", port => {
    if(!port) 
        throw new Error("Empty Port is not allowed");

    readline.question("Enter the signal(optional):", signal => {
        readline.close();
        app(port,signal);
    });
});

