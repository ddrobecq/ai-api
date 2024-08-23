import { GenerateContentRequest, StreamGenerateContentResult } from "@google-cloud/vertexai";
import initModel from "./init.js";
import { Transform } from  "stream";
import { GenericContentRequestOptions } from "../models.js";

/** function streamGenerateContent **
 * @param {string} prompt : prompt to generate content from
 * @param {string} modelName : model to use
 * @param {GenericContentRequestOptions} options : request options (temperature, max_tokens)
 * @return {stream} stream : stream of generated content
*/
export async function generateContentStream (prompt:string, modelName:string, options?: GenericContentRequestOptions) {
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
              const chunk = body.candidates[0].content.parts[0].text;
              this.push(chunk);
              callback();
          } catch (error) {
              callback(error); // Handle parsing errors
          }
        },
      }
    );

    const request = createRequest (prompt, modelName, options);

    try {
        const generativeModel = initModel(modelName);
        return generativeModel.generateContentStream(request)
        .then ((result: StreamGenerateContentResult) => {
            return ([result.stream, decodedData]);
        })
        .catch ((error: string) => {
            throw (error);
        });
        } 
    catch (error) {
        console.error(error);
        throw (error);
    }
};

/**
 * function generateContent
 * @param prompt {string} : prompt to generate content from
 * @param modelName {string} : model to use
 * @param options {GenericContentRequestOptions} : request options (temperature, max_tokens)
 * @returns {string} : generated content
 */
export async function generateContent (prompt: string, modelName: string, options?: GenericContentRequestOptions) {
    const request = createRequest (prompt, modelName, options);

    try {
        const generativeModel = initModel(modelName);
        const result = await generativeModel.generateContent(request);
        return (result.response.candidates[0].content.parts[0].text);
    } 
    catch (error) {
        console.error(error);
        throw (error);
    }
};

/**
 * function createRequest
 * @param prompt {string} : prompt to generate content from
 * @param modelName {string} : model to use
 * @param options {GenericContentRequestOptions} : request options (temperature, max_tokens)
 * @returns {GenerateContentRequest} : request formatted for Google AI
 */
function createRequest (prompt: string, modelName: string, options?: GenericContentRequestOptions): GenerateContentRequest {
    return {
        contents: [{role: 'user', parts: [{text: prompt}]}],
        generationConfig: {
            maxOutputTokens: options?.max_tokens || 256,
            temperature: options?.temperature || 0.5,
        }
    };
}