
const userService = require('../../services/v3/user');
const whatsappService = require('../../services/v3/whatsapp');
let queryString = require('query-string');
var appLoggers = require('../../apploggerV3.js');
var errorLogger = appLoggers.errorLogger;
var Buffer = require('buffer').Buffer;
module.exports = async (req, res) => {
    try {

        console.log("========== inside download media url ==========");

        let apikey = req.headers.apikey;

        let query1 = queryString.stringify(req.query);

        //initializing static content of url
        let url = "https://lookaside.fbsbx.com/whatsapp_business/attachments/?" + query1;

        if (!req.params) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'Media is required as parameter in URL',
                // data: []
            };
        }
        //validating api key
        let selectapikeyResult = await userService.selectapikey(apikey);

        if (selectapikeyResult[0][0].c <= 0) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'Authentication failed',
                data: {}
            };
        }

        // getting waba_id
        const getwabaidResult = await userService.fetchWabaId(apikey);
        const wabaId = getwabaidResult;
        const selectWabaIdResult = await userService.selectwabaId(wabaId);
        console.log("Select WabaId Result ====> ", selectWabaIdResult[0][0]);

        //getting system access token
        let SystemAccessToken;
        let getSystemAccessTokenResult;
        if (selectWabaIdResult[0][0].c === 1) {
            getSystemAccessTokenResult = await userService.getAccessTokenByWabaId(wabaId);

            if (!getSystemAccessTokenResult.access_token || getSystemAccessTokenResult.access_token.length === 0) {
                getSystemAccessTokenResult = await userService.getSystemAccessToken();
                console.log("Get Access Token By VALUE Result 1 ====> ", getSystemAccessTokenResult);
                SystemAccessToken = getSystemAccessTokenResult.VALUE;
            } else {
                console.log("Get Access Token By Wabaid Result ====> ", getSystemAccessTokenResult);
                SystemAccessToken = getSystemAccessTokenResult.access_token;
            }

        } else {
            getSystemAccessTokenResult = await userService.getSystemAccessToken();
            console.log("Get Access Token By VALUE Result 2 ====> ", getSystemAccessTokenResult);
            SystemAccessToken = getSystemAccessTokenResult.VALUE;
        }

        //download media from meta api
        let downloadMedia = await whatsappService.downloadCloudMedia(url, SystemAccessToken);

        res.header('Content-Type', downloadMedia.headers['content-type']);
        res.send(Buffer.from(downloadMedia.data));





    } catch (error) {
        console.log(error.response.data);
        errorLogger.error(JSON.stringify(error.response.data));
        res.send(error.response ? error.response.data : error);
    }
};