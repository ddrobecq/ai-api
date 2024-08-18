
import generateText from  './index.js';
//const aiAPI = require('./index.ts');

const myPrompt = "This is a test";
const model = 'gemini-1.5-flash-001';
const stream = false;

function main () {
    generateText (myPrompt, model, stream)
    .then ((result) => {
        console.log(result);
    })
    .catch ((error) => {
        console.error(error);
    }); 
}

main();