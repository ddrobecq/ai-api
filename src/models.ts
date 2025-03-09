import { GenereicModerationModel } from "./moderation";

type ModelAPI = 'OpenAI' | 'Vertex AI' | 'Google';
type ModelName = 'gpt-3.5' | 'gpt-3.5-turbo' | 'gpt-4o-mini' | 'gpt-4' | 'gpt-4-turbo' | 'gemini-1.5-flash' | 'gemini-1.5-pro' | 'gemini-2.0-flash';

export type Model = {
    id: number,
    name: ModelName,
    provider: ModelAPI
    isStreamingCompatible: boolean
    isImageSupported: boolean
    logo?: string
};

export type Models = Array<Model>;

export type GenericContentRequestOptions = {
    temperature?: number,
    max_tokens?: number,
    candidateCount?: number, //number of candidates to generate
    topK?: number, //probability of tokens to consider for each candidate (1=most probable token)
    topP?: number, //cumulative probability of tokens to consider for each candidate
    moderationModel?:GenereicModerationModel
}

/**
 * function getModelsList
 * @returns {Models} : list of available models
 */
export function getModelsList():Models {
    const modelsList:Models = [
        {
            id: 3,
            name: 'gpt-4o-mini',
            provider: 'OpenAI',
            isStreamingCompatible: false,
            isImageSupported : true
        },
        {
            id: 6,
            name: 'gpt-4-turbo',
            provider: 'OpenAI',
            isStreamingCompatible: false,
            isImageSupported : false
        },
        {
            id: 10,
            name: 'gpt-4',
            provider: 'OpenAI',
            isStreamingCompatible: false,
            isImageSupported : false
        },
        {
            id: 9,
            name: 'gemini-2.0-flash',
            provider: 'Vertex AI',
            isStreamingCompatible: true,
            isImageSupported : true
        },
    ];
    return modelsList;
}

/**
 * function getModel
 * @param id {number} : id of the model to get
 * @returns {Model} : model with the given id
 */
export function getModel(id:number):Model {
    const modelsList = getModelsList();
    if (id < 0 || id > modelsList.length || isNaN(id)) {
        throw new Error('Model not found');
    }
    return modelsList.filter(model => model.id === id)[0];
}