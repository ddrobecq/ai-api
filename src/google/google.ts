import { GenerateContentRequest, GenerateContentStreamResult, GenerativeModel, GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, Part } from "@google/generative-ai";
import process from 'process';
import { Transform } from  "stream";
import { GenericContentRequestOptions } from "../models";
import { GenericPrompt } from "..";

type Prompt = string | Part[];

/**
 * function initModel
 * @param {string} modelName : name of the model to initialize
 * @returns {GenerativeModel} : initialized model
 */
function initModel (modelName: string): GenerativeModel {
    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        }
    ];
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ 
        model: modelName,
        safetySettings: safetySettings
    });
    return model;
}

/**
 * function createPrompt : create a prompt from a generic or a list of parts compatible with Google AI
 * @param {GenericPrompt} prompt : prompt to generate convert into Google prompt 
 * @returns {Prompt} : Google prompt
 */
function createPrompt (prompt: GenericPrompt): Prompt {
    let promptRequest: Part[] = [];
    if (typeof prompt === 'string') {
        promptRequest = [{ text: prompt }];
    } else {
        prompt.map((part) => {
            let newPart: Part;
            if (part.type === 'text') {
                newPart = {text: part.text};
            } else {
                newPart = {
                    inlineData: {
                        data: part.url,
                        mimeType: part.mimeType
                    }
                };
            }
            promptRequest.push(newPart);
        });
    }
    return promptRequest;
}

/**
 * function createRequest
 * @param prompt {Prompt} : prompt to generate content from
 * @param modelName {string} : model to use
 * @param options {GenericContentRequestOptions} : request options (temperature, max_tokens)
 * @returns {GenerateContentRequest} : request formatted for Google AI
 */
function createRequest (prompt: GenericPrompt, options?: GenericContentRequestOptions):GenerateContentRequest {
    const promptRequest = createPrompt(prompt);
    return {
        contents: [
          {
            role: 'user',
            parts: promptRequest as Part[],
          }
        ],
        generationConfig: {
          maxOutputTokens: options?.max_tokens || 256,
          temperature: options?.temperature || 0.5,
          candidateCount: options?.candidateCount || 1,
          topK: options?.topK || 64,
          topP: options?.topP || 0.95,
        },
    };
}

/**
 * function generateContent
 * @param prompt {Prompt} : prompt to generate content from
 * @param modelName {string} : model to use
 * @param options {GenericContentRequestOptions} : request options (temperature, max_tokens)
 * @returns {string} : generated content
 */
export async function generateContent (prompt: GenericPrompt, modelName: string, options?: GenericContentRequestOptions) {
    const model = initModel(modelName);
    const request = createRequest (prompt, options);
    const result = await model.generateContent (request);
    const response = result.response.text();
    return response;
}

/**
 * function generateContentStream
 * @param prompt {Prompt} : prompt to generate content from
 * @param modelName {string} : model to use
 * @param options {GenericContentRequestOptions} : request options (temperature, max_tokens)
 * @returns {[Stream, Transform]} : stream of generated content and decoder to get the content
 */
export async function generateContentStream (prompt: GenericPrompt, modelName: string, options?: GenericContentRequestOptions) {
     /** function decodedData 
     * @purpose : transform the response stream to a json object
     * @param {object} body : response body
     * @param {string} encoding : response encoding
     * @param {function} callback : callback function
     * @return {object} chunk : transformed response
     * @return {function} callback : callback function
    */ 
    const decodedData = new Transform({
        objectMode: true,
        transform(body, encoding, callback) {
            try{
                //const chunk = body.candidates[0].content.parts[0].text;
                const chunk = body.text();
                this.push(chunk);
                console.log(chunk);
                callback();
            } catch (error) {
                callback(error); // Handle parsing errors
            }
        },
        }
    );
    try {
        const model = initModel(modelName);
        const request = createRequest (prompt, options);
        return model.generateContentStream(request)
            .then ((result: GenerateContentStreamResult) => {
            return ([result.stream, decodedData]);
        })
        .catch ((error: string) => {
            throw (error);
        });
        } 
    catch (error) {
        console.error(error.message);
        throw (error);
    }
} 
