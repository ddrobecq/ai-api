import * as vertexAI  from './vertexai/vertexai.js';
import * as openAI from './openai/openai.js';
import * as googleGenAI from './google/google.js';
import dotenv from 'dotenv';
import { getModelsList, getModel, GenericContentRequestOptions, Models } from './models.js';

dotenv.config();

/** function getModelsList **
 * @returns list of models
 */
export function getModels ():Models {
    return (getModelsList()); 
}

/** function generateContent **
 * @param {string} prompt : prompt to generate content from
 * @param {number} modelId : model to use
 * @param {boolean} stream : stream response if true
 * @param {GenericContentRequestOptions} options : request options (temperature, max_tokens)
 * @returns 
 */
export async function generateContent  (prompt: string, modelId: number, stream: boolean, options?: GenericContentRequestOptions) {
    const model = getModel(modelId);
    switch (model.provider) {
        case 'OpenAI':
            return (openAI.generateContent (prompt, model.name, options));
        case 'Google':
            if (stream) return (googleGenAI.generateContentStream (prompt, model.name, options));
            else return (googleGenAI.generateContent (prompt, model.name, options));
        case 'Vertex AI':
            if (stream) return (vertexAI.generateContentStream (prompt, model.name, options));
            else return (vertexAI.generateContent (prompt, model.name, options));
        default: {
            return ('Model not found');
        }
    }
}

/** function generateText **
 * DEPRECATED => use generateContent instead
 * TODO: remove this function
 * @purpose : call generative text API 
 * @param {*} prompt : data to generate text from
 * @param {string} model : the engine to use
 * @param {boolean} stream : stremaing response if true
 * @returns : promise to result
*/
export default async function generateText  (prompt: string, model: string, stream: boolean, options?: GenericContentRequestOptions) {
    const request = prompt;

    switch (model) {
        case 'gpt-3.5':
        case 'gpt-3.5-turbo':
        case 'gpt-4o-mini':
            return (openAI.generateContent (request, model, options));
        case 'gemini-1.5-flash-001':
            if (stream) return (vertexAI.generateContentStream (request, model, options));
            else return (vertexAI.generateContent (request, model, options));
        default: {
            console.error('Model not found');
            throw new Error('Model not found');
        }
    }
}