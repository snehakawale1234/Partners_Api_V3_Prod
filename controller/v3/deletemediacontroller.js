

const userService = require('../../services/v3/user');
const userService1 = require('../../services/v3/userStat');

const whatsappService = require('../../services/v3/whatsapp');
var appLoggers = require('../../apploggerV3.js');
var errorLogger = appLoggers.errorLogger;
var infoLogger = appLoggers.infoLogger;

module.exports = async (req, res) => {
    try {

        console.log("========= inside delete media ===========");

        let apikey = req.headers.apikey;
        let wanumber = null;
        let mediaid = req.params.mediaid;
        let phoneNumberId = req.query.phone_number_id;
        let token;
        if (!phoneNumberId) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'phoneNumberId is required',
                data: {}
            };
        }

        if (!req.params.mediaid) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'MediaId is required as parameter in URL',
                // data: []
            };
        }

        let selectapikeyResult = await userService.selectapikeyByPhoneId(apikey);

        if (selectapikeyResult[0][0] == undefined) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'Invalid API Key',
                data: {}
            };
        }

        let getUserIdbyPhnov3 = await userService1.getUserIdbyPhno(apikey, phoneNumberId);

        if (getUserIdbyPhnov3[0][0] === undefined) {

            return res.send({
                code: 100,
                status: "failed",
                message: "Invalid media of the user",
            });
        } else {
            //get wanumber from phonenumber id
            let wanumber1 = await userService.getWanumber(phoneNumberId);

            if (wanumber1 != undefined) {
                let wanumber1Str = wanumber1.wanumber.toString();

                if (wanumber1Str.startsWith("+")) {
                    wanumber = wanumber1Str.substring(1);
                }
                wanumber = parseInt(wanumber, 10); // Convert to integer

            } else {
                return {
                    code: '100',
                    status: 'FAILED',
                    message: 'Wanumber not found',
                    data: {}
                };
            }


            let selectwanumberResult = await userService.selectwanumber(wanumber);

            if (selectwanumberResult[0][0].c <= 0) {
                return {
                    code: '100',
                    status: 'FAILED',
                    message: 'Invalid Wanumber',
                    data: {}
                };
            }


            //getting user details
            let fetchmediausersdetailsResult = await userService.fetchmediausersdetails(apikey, wanumber);

            let phone_number_id = fetchmediausersdetailsResult[0][0].phone_number_id;
            let userid = fetchmediausersdetailsResult[0][0].userid;
            let result1 = null;
            if (phone_number_id != null && phone_number_id != undefined) {

                const selectPhoneNumberIdResult = await userService.selectPhoneNumberId(phoneNumberId);

                console.log("selectPhoneNumberIdResult ====> ", selectPhoneNumberIdResult[0][0]);

                //getting access token
                if (selectPhoneNumberIdResult[0][0].c === 1) {
                    const getSystemAccessTokenResult = await userService.getAccessTokenByPhoneNumberID(phoneNumberId);

                    if (!getSystemAccessTokenResult.access_token || getSystemAccessTokenResult.access_token.length === 0) {
                        const getSystemAccessTokenResult = await userService.getSystemAccessToken();
                        console.log("Get Access Token By VALUE Result 1 ====> ", getSystemAccessTokenResult);
                        token = getSystemAccessTokenResult.VALUE;
                    } else {
                        console.log("Get Access Token By phoneNumberId Result ====> ", getSystemAccessTokenResult);
                        token = getSystemAccessTokenResult.access_token;
                    }
                } else {
                    const getSystemAccessTokenResult = await userService.getSystemAccessToken();

                    console.log("Get Access Token By VALUE Result 2 ====> ", getSystemAccessTokenResult);

                    token = getSystemAccessTokenResult.VALUE;
                }

                result1 = await userService.getusersdetails(userid, wanumber);
                console.log("===========>", result1[0]);

                if (result1 != undefined && result1 != null && result1.length > 0) {
                    //called meta api
                    let deletMediaResult = await whatsappService.deleteMedia(mediaid, token);
                    // console.log(deletMediaResult);
                    infoLogger.info(JSON.stringify(deletMediaResult.data));
                    console.log("deletMediaResult================", JSON.stringify(deletMediaResult.data));
                    res.send(deletMediaResult.data);
                }

            } else {
                return {
                    code: '100',
                    status: 'FAILED',
                    message: 'phoneNumberId is required',
                    data: {}
                };
            }
        }
    } catch (error) {
        errorLogger.error(JSON.stringify(error.message));

        res.status(error.response.status).send(error.response ? error.response.data : error);

    }
};