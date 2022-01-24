const express  = require('express');
const app = express();
const url = require('url');

const googleOAuth = require('./oAuth2/google');
require('dotenv').config();

const options = {
    client_id: process.env.GOOGLE_OAUTH2_CLIENT_ID,
    client_secret: process.env.GOOGLE_OAUTH2_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_OAUTH2_REDIRECT_URI,
    scope: [
        'profile',
        'email'
    ]
}

app.get("/login/google", (req, res) => {
    googleOAuth.redirectToConsentScreen(options, res);
})

app.get("/login/google/callback", async (req, res) => {
    const queryParams = url.parse(req.url, true).query;
    const profile = await googleOAuth.getGoogleUserProfileData(options, queryParams.code);
    res.json(profile);
})

app.listen(8520 , () => {
    console.log('server started on the port 8520');
});