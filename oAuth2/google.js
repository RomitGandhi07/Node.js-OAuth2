const qs = require('querystring');
const { default: axios } = require('axios');
const {google} = require('googleapis');


const redirectToConsentScreen = (options, res) => {
    // //  Make oAuth2 Client
    // const oAuth2Client = new google.auth.OAuth2(
    //     options.clientID,
    //     options.clientSecret,
    //     options.callbackURL
    // );

    // //  Generate URL
    // const url = oAuth2Client.generateAuthUrl({
    //     access_type: 'offline',
    //     scope: options.scopes,
    // });

    // //  Redirect to URL
    // res.writeHead(302, { "Location": url});
    // return res.end();

    const queryParams = {
        client_id: options.client_id,
        redirect_uri: options.redirect_uri,
        access_type: "offline",
        response_type: "code",
        scope: options.scope.join(" ")
    }

    const rootURL = "https://accounts.google.com/o/oauth2/v2/auth";
    const qs = new URLSearchParams(queryParams);
    const URL = `${rootURL}?${qs.toString()}`;

    //  Redirect to URL
    res.writeHead(302, { "Location": URL});
    return res.end();
}


const getToken = async (options, code) => {
    try {
        const option = {
            code,
            client_id: options.client_id,
            client_secret: options.client_secret,
            redirect_uri: options.redirect_uri,
            grant_type : 'authorization_code'
        }

        const response = await axios.post('https://oauth2.googleapis.com/token', qs.stringify(option), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
        });
        return response.data
    } catch (error) {
        throw new Error("Something went wrong...")
    }
}

const getGoogleUser = async (tokens) => {
    try {
        const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,{
            headers: {
                Authorization: `Bearer ${tokens.id_token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error("Something went wrong...")
    }
}

const getGoogleUserProfileData = async (options, code) => {
    try {
        const tokens = await getToken(options, code);
        const googleUserProfile = getGoogleUser(tokens);
        return googleUserProfile;
    } catch (error) {
       console.log("Something went wrong...")
    }
}

module.exports = {redirectToConsentScreen, getGoogleUserProfileData};