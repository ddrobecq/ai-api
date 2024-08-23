import { OpenAI } from "openai";
import process from "node:process";
import { GenericContentRequestOptions } from "../models";

/** function generateContent **
 * @purpose : call generative text openAI API
 * @param {string} data : data to generate text from
 * @param {string} model : the model to use (gpt-3.5 | gpt-3.5-turbo | gpt-4o-mini)
 * @param {GenericContentRequestOptions} options : request options (temperature, max_tokens)
 * @returns : promise to result
 * @throws : error
 */
export async function generateContent (data: string, model: string, options?: GenericContentRequestOptions) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
    });
    
    try {
        const completion = await openai.chat.completions.create({
            model: model,
            temperature: options?.temperature || 0.5,
            max_tokens: options?.max_tokens || 256,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: data
                        }
                    ]
                }
            ]
        });
        return (completion.choices[0].message.content);
    } 
    catch (error) {
        console.error(error.message);
        throw (error);
    }
}