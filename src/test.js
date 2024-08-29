import { generateContent, getModels } from './index.js';
import fs from 'fs';
import { Buffer } from 'buffer';

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}
  
const textPart = {text: "A partir de l'image présentée : \
    Donne le nombre de cartes, \
    Puis, pour chaque carte, décris la carte en 2 lettres en fonction du modèle suivant : \
    Pour la première lettre : \
    R pour un Roi \
    D pour une Dame \
    V pour un Valet \
    C pour un Cavalier \
    10 pour un 10 \
    9 pour un 9 \
    8 pour un 8 \
    7 pour un 7 \
    6 pour un 6 \
    5 pour un 5 \
    4 pour un 4 \
    3 pour un 3 \
    2 pour un 2 \
    A pour un As \
    A pour un 1 \
    J pour un Joker \
    Pour le second caractère : \
    P pour Pique \
    T pour Trèfle \
    Q pour Carreau \
    C pour Cœur \
    Voici quelques exemples : RP pour Roi de Pique, 3T pour 3 de Trèfle, 7Q pour 7 de Carreau, VC pour le Valet de Coeur etc."};
  // Note: The only accepted mime types are some image types, image/*.



async function main () {
  const imagePath = `./images/cartes4.jpg`;
  const imagePart = fileToGenerativePart(
    imagePath,
    "image/jpeg",
  );

  const options = {
    temperature: 0,
    max_tokens: 100,
    topK: 1,
    candidateCount: 1
  };

  const genericImagePart = {
    type: "image",
    url: imagePart.inlineData.data,
    mimeType: "image/jpeg",
  };
  const genericTextPart = {
    type: "text",
    text: textPart.text,
  };
  const genericPrompt = [ genericImagePart, genericTextPart ];

//  const myPrompt = [ imagePart, textPart ];

  const models = getModels();
  models.forEach(async function(model) {
    if (model.isImageSupported) {
      const response = await generateContent(genericPrompt, 4, false, options);
      console.log(`${model.provider}/${model.name}`, response);
    }
  });
}

main();