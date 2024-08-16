
//import callTextGeneratorAPI from './index.js';
const callTextGeneratorAPI = require('./index.js');

const prompt = "This is a test";
const model = 'gemini-1.5-flash-001';
const stream = false;

function main () {
    const response  = callTextGeneratorAPI.callTextGeneratorAPI (prompt, model, stream)
    .then (result => {
        console.log(result);
    })
    .catch (error => {
        console.error(error);
    }); 
}

main();