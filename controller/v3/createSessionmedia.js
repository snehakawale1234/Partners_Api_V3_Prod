
const user = require('../../services/v3/user');
const whatsappService = require('../../services/v3/whatsapp');
let queryString = require('query-string');
var appLoggers = require('../../apploggerV3.js');
var errorLogger = appLoggers.errorLogger;
var infoLogger = appLoggers.infoLogger;

module.exports = async (req, res) => {
    try {

        console.log("========== inside create session media ==========");

        let apikey = req.headers.apikey;
        let access_token;
        let query1 = queryString.stringify(req.query);

        if (!req.headers.apikey) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'apikey is required as parameter in header',
                data: {}
            };
        }

        //validating apikey
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
                if (selectWabaIdResult[0][0].c == 1) {
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
                    const getSystemAccessTokenResult = await user.getSystemAccessToken();
                    console.log("Get Access Token By VALUE Result 2 ====> ", getSystemAccessTokenResult);
                    access_token = getSystemAccessTokenResult.VALUE;
                }

                let objData = {
                    access_token,
                };

                const stringified = query1;
                //calling meta api 
                let get_template1result = await whatsappService.createSessionmedia1(objData, stringified);
                if (!get_template1result.response) {
                    //logging result logger file
                    infoLogger.info(JSON.stringify(get_template1result.data));
                    console.log("TemplateresultResponse1=============", JSON.stringify(get_template1result.data));
                    return res.status(200).send(
                        get_template1result.data,
                    );
                } else {
                    console.log("TemplateresultResponse2=============", JSON.stringify(get_template1result.response.data));
                    infoLogger.info(JSON.stringify(get_template1result.response.data));
                    return res.status(200).send(
                        get_template1result.response.data,
                    );
                }
            }
        }
    } catch (error) {
        errorLogger.error(JSON.stringify(error.message));
        return res.status(500).send(error.message);
    }

};
