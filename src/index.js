require('dotenv').config()
const vertexai = require('./vertexai/vertexai.js');
const openai = require('./openai/openai.js');

//console.log(process.env);

//import vertexai from './vertexai/vertexai.js';
//import openai from './openai/openai.js';

/** function callTextGeneratorAPI **
 * @purpose : call generative text API 
 * @param {*} prompt : data to generate text from
 * @param {string} model : the engine to use
 * @param {boolean} stream : stremaing response if true
 * @returns : promise to result
*/
async function callTextGeneratorAPI  (prompt, model, stream) {
    /*const request = `En te basant uniquement sur les données suivantes : \n ${JSON.stringify(data)} \n \
    Fais un résumé, en français, à la façon d'un journaliste sportif, 
    de la carrière à l'AS Monaco du joueur en insistant sur sa meilleure saison`;*/

    const request = prompt;

    const defaultModel = 'gpt-3.5-turbo';

    switch (model) {
        case 'gpt-3.5':
        case 'gpt-3.5-turbo':
        case 'gpt-4o-mini':
            return (openai.chatGPT (request, model));
        case 'gemini-1.5-flash-001':
            if (stream) return (vertexai.streamGenerateContent (request));
            else return (vertexai.generateContent (request));
        default:
            return (openai.chatGPT (request, defaultModel));
    }
}
exports.callTextGeneratorAPI = callTextGeneratorAPI;