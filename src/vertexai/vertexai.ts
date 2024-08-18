import { GenerativeModel, StreamGenerateContentResult } from "@google-cloud/vertexai";
import initModel from "./init.js";
import { Transform } from  "stream";

let generativeModel:GenerativeModel = null;

/** function streamGenerateContent **
 * @param {string} prompt : prompt to generate content from
 * @return {stream} stream : stream of generated content
*/
export async function generateStreamContent (prompt:string) {
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

    const request = {
        contents: [{role: 'user', parts: [{text: prompt}]}],
    };
    try {
        if (!generativeModel) {
            generativeModel = initModel();
        }
        return generativeModel.generateContentStream(request)
        .then ((result: StreamGenerateContentResult) => {
            return ([result.stream, decodedData]);
        })
        .catch ((error: string) => {
            throw (error);
        });
        } 
    catch (error) {
        if (error.response) {
            console.error(error.response.status);
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }
        throw (error);
    }
};

export async function generateContent (prompt: string) {
    const request = {
        contents: [{role: 'user', parts: [{text: prompt}]}],
    };

    try {
        if (!generativeModel) {
            generativeModel = initModel();
        }
        const result = await generativeModel.generateContent(request);
        return (result.response.candidates[0].content.parts[0].text);
    } 
    catch (error) {
        if (error.response) {
            console.error(error.response.status);
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }
        throw (error);
    }
};