type ModelAPI = 'OpenAI' | 'Vertex AI' | 'Google';
type ModelName = 'gpt-3.5' | 'gpt-3.5-turbo' | 'gpt-4o-mini' | 'gpt-4' | 'gpt-4-turbo' | 'gemini-1.5-flash-001' | 'gemini-1.5-flash';

export type Model = {
    id: number,
    name: ModelName,
    provider: ModelAPI
    isStreamingCompatible: boolean
    logo?: string
};

export type Models = Array<Model>;

export type GenericContentRequestOptions = {
    temperature?: number,
    max_tokens?: number
}

/**
 * function getModelsList
 * @returns {Models} : list of available models
 */
export function getModelsList():Models {
    const modelsList:Models = [
        {
            id: 1,
            name: 'gpt-3.5',
            provider: 'OpenAI',
            isStreamingCompatible: false
        },
        {
            id: 2,
            name: 'gpt-3.5-turbo',
            provider: 'OpenAI',
            isStreamingCompatible: false
        },
        {
            id: 3,
            name: 'gpt-4o-mini',
            provider: 'OpenAI',
            isStreamingCompatible: false
        },
        {
            id: 4,
            name: 'gemini-1.5-flash-001',
            provider: 'Vertex AI',
            isStreamingCompatible: true
        },
        {
            id: 5,
            name: 'gemini-1.5-flash',
            provider: 'Google',
            isStreamingCompatible: false
        },
        {
            id: 6,
            name: 'gpt-4-turbo',
            provider: 'OpenAI',
            isStreamingCompatible: false
        },
        {
            id: 6,
            name: 'gpt-4',
            provider: 'OpenAI',
            isStreamingCompatible: false
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
    return modelsList.filter(model => model.id === id)[0];
}