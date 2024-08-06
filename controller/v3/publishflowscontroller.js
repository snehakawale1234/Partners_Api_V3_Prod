const userService = require("../../services/v3/userStat");
const user = require('../../services/v3/user');
const whatsappService = require('../../services/v3/whatsapp');
var appLoggers = require('../../apploggerV3.js');
var errorLogger = appLoggers.errorLogger;
var infoLogger = appLoggers.infoLogger;

module.exports = async (req, res) => {

    try {
        console.log("===========publish===========");
        let apikey = req.headers.apikey;
        let id = req.params.id;
        let body = req.body;
        let access_token;


        if (!req.headers.apikey) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'apikey is required as parameter in header',
                data: {}
            };
        }
        if (!req.params.id) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'wabaid is required as parameter in URL',
                data: {}
            };
        }
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
                let wabaid = await userService.getFlowData(id);
                if (wabaid.length == 0) {
                    return {
                        code: '100',
                        status: 'FAILED',
                        message: 'Flow not found',
                        data: {}
                    };
                }
                let getusersv3 = await userService.getUserId(apikey, wabaid[0].wabaid);
                if (getusersv3[0][0] == undefined) {
                    return res.status(401).send({
                        code: 100,
                        status: "failed",
                        message: "Authentication Failed"
                    });
                }
                //getting access token
                const selectWabaIdResult = await user.selectwabaId(wabaid[0].wabaid);
                console.log("Select WabaId Result ====> ", selectWabaIdResult[0][0]);
                if (selectWabaIdResult[0][0].c == 1) {
                    const getSystemAccessTokenResult = await user.getAccessTokenByWabaId(wabaid[0].wabaid);

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


                let apiu = 'v18.0/' + id + '/publish';
                let objData = {
                    access_token,
                    body
                };
                let send_templateresult = await whatsappService.postreq1_V3(objData, apiu);

                console.log({ send_templateresult });
                if (send_templateresult.status === 200) {

                    infoLogger.info(JSON.stringify(send_templateresult.data));
                    await userService.UpdateWhatsappFlowStatustoPublish(id);
                    return res.status(200).send(
                        send_templateresult.data
                    );
                } else {

                    let ststus112 = send_templateresult.response.status;
                    infoLogger.info(JSON.stringify(send_templateresult.response.data));
                    // console.log("response:================================", (JSON.stringify(send_templateresult.response.data)));
                    return res.status(ststus112).send(
                        send_templateresult.response.data
                    );

                }

            }
        }




    } catch (error) {
        errorLogger.error(JSON.stringify(error.message));
        return res.status(500).send(
            error.message
        );
        // return res.send(error.message);
    }

};