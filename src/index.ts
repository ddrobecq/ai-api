import * as vertexAI  from './vertexai/vertexai.js';
import * as openAI from './openai/openai.js';
import * as googleGenAI from './google/google.js';
import dotenv from 'dotenv';
import { getModelsList, getModel, GenericContentRequestOptions, Models } from './models.js';

dotenv.config();
type GenericPartText = {
    type: 'text',
    text: string
};
type GenericPartImage = {
    type: 'image',
    url: string,
    mimeType: string
};
type GenericPart = GenericPartText | GenericPartImage;
export type GenericPrompt = GenericPart[] | string;

/** function getModelsList **
 * @returns list of models
 */
export function getModels ():Models {
    return (getModelsList()); 
}

/** function getModel **
 * @param {number} modelId : model id
 * @returns model
 */
export function getModelInfo (modelId: number) {
    return (getModel(modelId));
}

/** function generateContent **
 * @param {GenericPrompt} prompt : prompt to generate content from
 * @param {number} modelId : model to use
 * @param {boolean} stream : stream response if true
 * @param {GenericContentRequestOptions} options : request options (temperature, max_tokens)
 * @returns 
 */
export async function generateContent  (prompt: GenericPrompt, modelId: number, stream: boolean, options?: GenericContentRequestOptions) {
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
