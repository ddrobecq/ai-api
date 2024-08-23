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
