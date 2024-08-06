
const user = require('../../services/v3/user');
const whatsappService = require('../../services/v3/whatsapp');
const userService = require('../../services/v3/userStat');
var appLoggers = require('../../apploggerV3.js');
var errorLogger = appLoggers.errorLogger;
var infoLogger = appLoggers.infoLogger;

module.exports = async (req, res) => {

    try {

        let apikey = req.headers.apikey;
        let id = req.params.id;
        let body = req.body;
        let business_public_key = req.body.business_public_key;
        let wanumber = null;
        let wabaid = null;
        let userid = null;

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
                message: 'phone number id is required as parameter in URL',
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


                let getusersv3 = await userService.getUserIdbyPhno(apikey, id);

                if (getusersv3[0][0] == undefined) {
                    return res.status(401).send({
                        code: 100,
                        status: "failed",
                        message: "Authentication Failed"
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

                    // '/v18.0/' + id + '/messages';
                    let apiu = '/v18.0/' + id + '/whatsapp_business_encryption';
                    let objData = {
                        access_token,
                        body
                    };
                    let send_templateresult = await whatsappService.postreq1_V3(objData, apiu);


                    if (send_templateresult.status === 200) {
                        const msgResult = await userService.getMsgSettingDetails(id);
                        wanumber = msgResult[0].wanumber;
                        wabaid = msgResult[0].whatsapp_business_account_id;
                        userid = msgResult[0].userid;
                        console.log({ wanumber, wabaid, userid });
                        let phoneid_result = await user.phoneid_count(id);
                        console.log("=======phoneid result============", phoneid_result.c);

                        if (phoneid_result.c == 0) {
                            await userService.SetBusinessPublicKeyStatus(wanumber, id, wabaid, userid, business_public_key);
                        } else {
                            await userService.updateBusinessPublicKeyStatus(id, business_public_key);
                        }
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
        // return res.send(error.message);
    }

};