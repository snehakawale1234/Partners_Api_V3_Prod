
const user = require('../../services/v3/user');
const whatsappService = require('../../services/v3/whatsapp');
const userService1 = require('../../services/v3/userStat');
var appLoggers = require('../../apploggerV3.js');
var errorLogger = appLoggers.errorLogger;
var infoLogger = appLoggers.infoLogger;
module.exports = async (req, res) => {

    try {

        let apikey = req.headers.apikey;
        let id = req.params.id;

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
                message: 'Phone no id is required as parameter in URL',
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
                let getusersv3 = await userService1.getUserIdbyPhno(apikey, id);

                if (getusersv3[0][0] == undefined) {
                    return res.status(401).send({
                        code: 100,
                        status: "failed",
                        message: "Authentication Failed / proper Phone no id "
                    });
                } else {
                    const selectPhoneNumberIdResult = await user.selectPhoneNumberId(id);
                    console.log("Select WabaId Result ====> ", selectPhoneNumberIdResult[0][0]);
                    //getting access token
                    if (selectPhoneNumberIdResult[0][0].c == 1) {
                        const getSystemAccessTokenResult = await user.getAccessTokenByPhoneNumberID(id);

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
                    let apiu = '/v18.0/' + id + '/whatsapp_business_encryption';
                    let objData = {
                        access_token,
                    };

                    let send_templateresult = await whatsappService.getreq1_V3(objData, apiu);

                    if (send_templateresult.status === 200) {
                        infoLogger.info(JSON.stringify(send_templateresult.data));
                        return res.status(200).send(
                            send_templateresult.data
                        );
                    } else {

                        let ststus112 = send_templateresult.response.status;
                        infoLogger.info(JSON.stringify(send_templateresult.response.data));
                        console.log("response:================================", (JSON.stringify(send_templateresult.response.data)));
                        return res.status(ststus112).send(
                            send_templateresult.response.data
                        );

                    }




                }
            }
        }




    } catch (error) {
        errorLogger.error(JSON.stringify(error.message));
        return res.status(500).send(
            error.message
        );
    }

};