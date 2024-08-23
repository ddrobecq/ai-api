
//import generateText from  './index.js';
import { generateContent } from './index.js';

const myPrompt = "Write a story about a magic backpack.";
//const model = 'gemini-1.5-flash-001';
const stream = true;

/*function fileToGenerativePart(path, mimeType) {
    return {
      inlineData: {
        data: Buffer.from(fs.readFileSync(path)).toString("base64"),
        mimeType,
      },
    };
  }
  
  const prompt = "Describe how this product might be manufactured.";
  // Note: The only accepted mime types are some image types, image/*.
  const imagePart = fileToGenerativePart(
    `${mediaPath}/jetpack.jpg`,
    "image/jpeg",
  );

const myPrompt = [ prompt, imagePart ];
*/

async function main () {
/*    generateText (myPrompt, model, stream)
    .then ((result) => {
        console.log(result);
    })
    .catch ((error) => {
        console.error(error);
    }); 
*/
/*
let response = null;
let decoder = null;
[response, decoder] = await generateContent(myPrompt, 5, stream);
for await (const chunk of response) {
    const chunkText = chunk.text();
    console.log(chunkText);
}
*/
 const response = await generateContent(myPrompt, 5, false);
 console.log(response);
}

main();