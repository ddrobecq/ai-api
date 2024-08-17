const {
    HarmBlockThreshold,
    HarmCategory,
    VertexAI
} = require('@google-cloud/vertexai');
const process = require('process');

function initModel () {
    const GOOGLE_API_PRIVATE_KEY_ID = process.env.GOOGLE_API_PRIVATE_KEY_ID;
    const GOOGLE_API_PRIVATE_KEY = process.env.GOOGLE_API_PRIVATE_KEY;
    const GOOGLE_API_PROJECT_ID = process.env.GOOGLE_API_PROJECT_ID;
    const GOOGLE_API_CLIENT_EMAIL = process.env.GOOGLE_API_CLIENT_EMAIL;
    const GOOGLE_API_CLIENT_ID = process.env.GOOGLE_API_CLIENT_ID;

    // TO PUT IN ENVIRONMENT VARIABLES
    const location = process.env.GOOGLE_API_REGION;
    const authOptions = {
        credentials: {
            type: "service_account",
            project_id: GOOGLE_API_PROJECT_ID,
            private_key_id: GOOGLE_API_PRIVATE_KEY_ID,
            private_key: GOOGLE_API_PRIVATE_KEY.replace(/\\n/g, '\n'),
            client_email: GOOGLE_API_CLIENT_EMAIL,
            client_id: GOOGLE_API_CLIENT_ID,
            auth_uri: "https://accounts.google.com/o/oauth2/auth",
            token_uri: "https://oauth2.googleapis.com/token",
            auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
            client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/supporter%40the-experience-372216.iam.gserviceaccount.com",
            universe_domain: "googleapis.com"
        }
    };

    const vertexOptions = {
        project: GOOGLE_API_PROJECT_ID, 
        location: location,
        googleAuthOptions: authOptions,
    }

    const vertexAI = new VertexAI(vertexOptions);

    const textModel =  'gemini-1.5-flash-001';

    // Instantiate Gemini models
    const generativeModel = vertexAI.getGenerativeModel({
        model: textModel,
        // The following parameters are optional
        // They can also be passed to individual content generation requests
        safetySettings: [{category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE}],
        generationConfig: {maxOutputTokens: 500},
    });
    return generativeModel;
}
exports.initModel = initModel;