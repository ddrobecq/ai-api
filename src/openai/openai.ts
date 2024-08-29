import { OpenAI } from "openai";
import process from "process";
import { GenericContentRequestOptions } from "../models";
import { ChatCompletionContentPart } from "openai/resources";
import { GenericPrompt } from "..";

type Prompt = string | ChatCompletionContentPart[];

function createRequest (prompt: GenericPrompt, model: string, options?: GenericContentRequestOptions): OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming {
    const promptRequest = createPrompt(prompt);
    return {
        model: model,
        temperature: options?.temperature || 0.5,
        max_tokens: options?.max_tokens || 256,
        n: options?.candidateCount || 1,
        top_p: options?.topP || 1,
        messages: [
            {
                role: "user",
                content: promptRequest
            }
        ]
    };
}

/** function generateContent **
 * @purpose : call generative text openAI API
 * @param {string} data : data to generate text from
 * @param {string} model : the model to use (gpt-3.5 | gpt-3.5-turbo | gpt-4o-mini)
 * @param {GenericContentRequestOptions} options : request options (temperature, max_tokens)
 * @returns : promise to result
 * @throws : error
 */
export async function generateContent (prompt: GenericPrompt, model: string, options?: GenericContentRequestOptions) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
    });
    
    try {
        const request = createRequest (prompt, model, options);
        const completion = await openai.chat.completions.create(request);
        return (completion.choices[0].message.content);
    } 
    catch (error) {
        console.error(error.message);
        throw (error);
    }
}

/**
 * function createPrompt : create a prompt from a generic or a list of parts compatible with OpenAI
 * @param {GenericPrompt} prompt : prompt to generate convert into OpenAI prompt 
 * @returns {Prompt} : Google prompt
 */
function createPrompt (prompt: GenericPrompt): Prompt {
    let promptRequest: ChatCompletionContentPart[] = [];
    if (typeof prompt === 'string') {
        promptRequest = [{ 
            type: "text",
            text: prompt 
        }];
    } else {
        prompt.map((part) => {
            let newPart: ChatCompletionContentPart;
            if (part.type === 'text') {
                newPart = {
                    type: "text",
                    text: part.text};
            } else {
                newPart = {
                    type: "image_url",
                    image_url: {
                        url : `data:${part.mimeType};base64,${part.url}`
                    }
                };
            }
            promptRequest.push(newPart);
        });
    }
    return promptRequest;
}
