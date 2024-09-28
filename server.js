import { initBaseAuth } from '@propelauth/node';

require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

const cors = require('cors');

app.use(cors({
  origin: '*'
}));

// Set up Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Endpoint to handle content generation requests
app.post('/generate', async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


const {
    validateAccessTokenAndGetUser,
    fetchUserMetadataByUserId,
    // ...
} = initBaseAuth({
    authUrl: "https://72212551402.propelauthtest.com",
    apiKey: "94ed30c903184a6f2d7db86ad5ef1f4026b3a52b278ee88d147e9df129c852d748243de598f832fd43f820b6b52bbcea", 
});

app.get('/example', async (req, res) => {
    const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader) {
        return res.status(401).send('Unauthorized');
    }

    const token = authorizationHeader.startsWith('Bearer ') ? authorizationHeader.slice(7, authorizationHeader.length) : authorizationHeader;

    try {
        const user = await validateAccessTokenAndGetUser(authorizationHeader)
        console.log(`Got request from user ${user.userId}`);
    } catch (err) {
        // You can return a 401, or continue the request knowing it wasn't sent from a logged-in user
        console.log(`Unauthorized request ${err}`);
    }
});