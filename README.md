# AI API

This is a generic API for calling different Generative AI models (OpenAI, VertexAI, Google, ...). The API could be invoked with some text, images or video prompt to get text or strem. It implements a Node.js module to be imported in your project

# Available models
## Google 
### Vertex AI - Recommended
 - gemini-2.0-flash
 #### Procédure
 Get the following values from the Google credential JSON file by the <a href="https://stackoverflow.com/questions/58460476/where-to-find-credentials-json-for-google-api-client" target=" blank">procedure</a>
 Get the complete procedure from <a href="https://developers.google.com/workspace/guides/create-credentials?hl=fr#service-account" target=" blank">here</a>
### Generative API
Simpler but only for test or non industrial projects
 - gemini-1.5-flash
#### Procédure
  Get your API key following this <a href="https://ai.google.dev/gemini-api/docs/api-key?hl=fr" target=" blank">procedure</a>
## Open AI
 - gpt-3.5
 - gpt-3.5-turbo
 - gpt-4o-mini

# Installation
## Add in your project
```bash
npm install @drobs/ai-api
```
## Add the environement variables
### Google API (Vertex API) 
 - GOOGLE_API_PROJECT_ID=Your Project ID (ex : the-experience-xxxxx)
 - GOOGLE_API_PRIVATE_KEY_ID=Your Private Key ID (ex : 87adbdad1eb9b1540edf867bd8d79926eb2ad5c8)
 - GOOGLE_API_PRIVATE_KEY=Your Private Key (ex : -----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkq...oq4SQJbV\n-----END PRIVATE KEY-----\n)
 - GOOGLE_API_CLIENT_EMAIL=Your Google Account allowed to use VertexAI API (ex : user@project-projectid.iam.gserviceaccount.com)
 - GOOGLE_API_CLIENT_ID=Your Google Client ID (ex : 107696212857897829246)
 - GOOGLE_API_REGION=Your Google Region (ex : europe-west9)
 - GOOGLE_API_CLIENT_CERT_URL=https://www.googleapis.com/...
### Google API (Generative API)
 - GOOGLE_API_PRIVATE_KEY=Your Private Key
### Open API
 - OPENAI_API_KEY=Your Open API Key (ex : sk-tfB0mBpLPyQFeUzR7R48issEmHrjNbzCYsT3BlbkFJev3ZGj)

# Usage
## Procedure
### Import functions from @drobs/ai-api module
 ```js
import { generateContent, getModels } from './index.js';
```
### Choose your model from getModels
### (Optional) Choose options for your request
 ```js
const options = {
    temperature: 0, //from 0 (very deterministic) to 2 (very creative)
    max_tokens: 100, //number of tken for the expected response
    topK: 64, //probability of tokens to consider for each candidate (1=most probable token) (only for Google models)
    topP: 1, //cumulative probability of tokens to consider for each candidate
    candidateCount: 1 //number of candidate responses that will be return by the model
    moderationModel:{} //soon available
}
```
### Create your prompt request
 ```js
const prompt = 'Tell me a story';
```
### Invoke generateContent with the chosen model
 ```js
const response = generateContent (prompt, model, false, options);
console.log (response);
```
## Example
```js
import { generateContent } from '@drobs/ai-api';

const prompt = "This is a test";
const model = 4;  //Gemini 1.5 Flash via Vertex AI
const stream = false;
const options = {
    temperature: 0,
    max_tokens: 100,
    topP: 1,
    candidateCount: 1
}

function main () {
    generateContent (prompt, model, stream, options)
    .then (result => {
        console.log(result);
    })
    .catch (error => {
        console.error(error);
    }); 
}

main();
```

# Contribute
## GitHub Repository
Please feel free to contribute or report any issue on <a href="https://github.com/ddrobecq/ai-api" target="_blank">GitHub</a>
## Compile
```bash
npm run build
```
## Test
```bash
node run test
```
