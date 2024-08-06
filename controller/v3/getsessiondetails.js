
const user = require('../../services/v3/user');
const whatsappService = require('../../services/v3/whatsapp');
let queryString = require('query-string');
var appLoggers = require('../../apploggerV3.js');
var errorLogger = appLoggers.errorLogger;
var infoLogger = appLoggers.infoLogger;

module.exports = async (req, res) => {
    try {

        console.log("========== inside get session details ==========");

        let query1 = queryString.stringify(req.query);
        let id1 = JSON.stringify(req.params);
        let id2 = id1;
        let obj = req.params;
        let id = "upload" + obj["*"];
        let fileType;
        let access_token;
        let status123;

        let apikey = req.headers.apikey;

        if (!req.headers.apikey) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'apikey is required as parameter in header',
                data: {}
            };
        }
        if (!req.params) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'id is required as parameter in URL',
                data: {}
            };
        }

        fileType = req.headers['content-type'];
        //validating api key
        const selectapikeyResult = await user.selectapikey(apikey);


        if (selectapikeyResult[0].length == 0) {
            return res.send({
                code: 100,
                status: "failed",
                message: "Invalid apikey"
            });
        } else {
            if (selectapikeyResult[0][0].c == 0) {
                return res.status(401).send({
                    code: 100,
                    status: "failed",
                    message: "Invalid apikey"
                });
            } else {

                // getting waba_id
                const getwabaidResult = await user.fetchWabaId(apikey);
                const wabaId = getwabaidResult;
                const selectWabaIdResult = await user.selectwabaId(wabaId);
                console.log("Select WabaId Result ====> ", selectWabaIdResult[0][0]);

                //getting access token

                if (selectWabaIdResult[0][0].c === 1) {
                    const getSystemAccessTokenResult = await user.getAccessTokenByWabaId(wabaId);
                    if (!getSystemAccessTokenResult.access_token || getSystemAccessTokenResult.access_token.length === 0) {
                        const getSystemAccessTokenResult = await user.getSystemAccessToken();
                        console.log("Get Access Token By VALUE Result 1 ====> ", getSystemAccessTokenResult);
                        access_token = getSystemAccessTokenResult.VALUE;
                    } else {
                        console.log("Get Access Token By Wabaid Result ====> ", getSystemAccessTokenResult);
                        access_token = getSystemAccessTokenResult.access_token;
                    }
                } else {
                    //getting system access token
                    const getSystemAccessTokenResult = await user.getSystemAccessToken();
                    console.log("Get Access Token By VALUE Result 2 ====> ", getSystemAccessTokenResult);
                    access_token = getSystemAccessTokenResult.VALUE;
                }

                fileType = req.headers['content-type'];
                obj = req.params;
                id = "upload" + obj["*"] + "?" + query1;
                //meta api called
                const uploadsResult = await whatsappService.getmediaseddiondetails(id, access_token);

                if (!uploadsResult.response) {

                    infoLogger.info(JSON.stringify(uploadsResult));
                    return res.status(200).send(
                        uploadsResult
                    );
                } else {

                    status123 = uploadsResult.response.status;

                    infoLogger.info(JSON.stringify(uploadsResult.response.data));
                    console.log("uploadsResult.response.data=====================", JSON.stringify(uploadsResult.response.data));
                    return res.status(status123).send(
                        uploadsResult.response.data,
                    );
                }
            }
        }

    } catch (error) {
        errorLogger.error(JSON.stringify(error.message));
        return res.status(500).send(error.message);
    }

};
