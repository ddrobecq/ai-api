import { GenerateContentRequest, GenerateContentStreamResult, GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import process from 'process';
import { Transform } from  "stream";
import { GenericContentRequestOptions } from "../models";

/**
 * function initModel
 * @param {string} modelName : name of the model to initialize
 * @returns {GenerativeModel} : initialized model
 */
function initModel (modelName: string): GenerativeModel {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: modelName });
    return model;
}

/**
 * function createRequest
 * @param prompt {string} : prompt to generate content from
 * @param modelName {string} : model to use
 * @param options {GenericContentRequestOptions} : request options (temperature, max_tokens)
 * @returns {GenerateContentRequest} : request formatted for Google AI
 */
function createRequest (prompt: string, modelName: string, options?: GenericContentRequestOptions):GenerateContentRequest {
    return {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: prompt,
              }
            ],
          }
        ],
        generationConfig: {
          maxOutputTokens: options?.max_tokens || 256,
          temperature: options?.temperature || 0.5,
        }
    };
}

/**
 * function generateContent
 * @param prompt {string} : prompt to generate content from
 * @param modelName {string} : model to use
 * @param options {GenericContentRequestOptions} : request options (temperature, max_tokens)
 * @returns {string} : generated content
 */
export async function generateContent (prompt: string, modelName: string, options?: GenericContentRequestOptions) {
    const model = initModel(modelName);
    const request = createRequest (prompt, modelName, options);
    const result = await model.generateContent (request);
    const response = result.response.text();
    console.log(response);
    return response;
}

/**
 * function generateContentStream
 * @param prompt {string} : prompt to generate content from
 * @param modelName {string} : model to use
 * @param options {GenericContentRequestOptions} : request options (temperature, max_tokens)
 * @returns {[Stream, Transform]} : stream of generated content and decoder to get the content
 */
export async function generateContentStream (prompt: string, modelName: string, options?: GenericContentRequestOptions) {
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
        const request = createRequest (prompt, modelName, options);
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
