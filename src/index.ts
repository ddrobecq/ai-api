import { generateContent as vertexaiGenerateContent, generateStreamContent as vertexaiGenerateStreamContent } from './vertexai/vertexai.js';
import { generateContent as openaiGenerateContent } from './openai/openai.js';
import dotenv from 'dotenv';
dotenv.config();

/** function generateText **
 * @purpose : call generative text API 
 * @param {*} prompt : data to generate text from
 * @param {string} model : the engine to use
 * @param {boolean} stream : stremaing response if true
 * @returns : promise to result
*/
export default async function generateText  (prompt: string, model: string, stream: boolean) {
    /*const request = `En te basant uniquement sur les données suivantes : \n ${JSON.stringify(data)} \n \
    Fais un résumé, en français, à la façon d'un journaliste sportif, 
    de la carrière à l'AS Monaco du joueur en insistant sur sa meilleure saison`;*/

    const request = prompt;

    const defaultModel = 'gpt-3.5-turbo';

    switch (model) {
        case 'gpt-3.5':
        case 'gpt-3.5-turbo':
        case 'gpt-4o-mini':
            return (openaiGenerateContent (request, model));
        case 'gemini-1.5-flash-001':
            if (stream) return (vertexaiGenerateStreamContent (request));
            else return (vertexaiGenerateContent (request));
        default: {
            console.warn('Model not found : use default model');
            return (openaiGenerateContent (request, defaultModel));
        }
    }
}