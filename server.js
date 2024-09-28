import { initBaseAuth } from '@propelauth/node';

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