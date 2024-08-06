

const userService = require('../../services/v3/user');
const userService1 = require('../../services/v3/userStat');
const whatsappService = require('../../services/v3/whatsapp');
var appLoggers = require('../../apploggerV3.js');
var errorLogger = appLoggers.errorLogger;
var Buffer = require('buffer').Buffer;


module.exports = async (req, res) => {
    try {

        let apikey = req.headers.apikey;
        let wanumber = null;
        let mediaid = req.params.mediaid;
        let phoneNumberId = req.query.phone_number_id;

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

            };
        }
        //validating api key
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
            //get wabanumber from phone id
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

            let fetchmediausersdetailsResult = await userService.fetchmediausersdetails(apikey, wanumber);

            let phone_number_id = fetchmediausersdetailsResult[0][0].phone_number_id;
            let userid = fetchmediausersdetailsResult[0][0].userid;

            let result1 = null;
            if (phone_number_id != null && phone_number_id != undefined) {

                const selectPhoneNumberIdResult = await userService.selectPhoneNumberId(phoneNumberId);

                console.log("selectPhoneNumberIdResult ====> ", selectPhoneNumberIdResult[0][0]);
                let SystemAccessToken;
                //getting access token from  phone number id
                if (selectPhoneNumberIdResult[0][0].c === 1) {
                    const getSystemAccessTokenResult = await userService.getAccessTokenByPhoneNumberID(phoneNumberId);

                    if (!getSystemAccessTokenResult.access_token || getSystemAccessTokenResult.access_token.length === 0) {
                        const getSystemAccessTokenResult = await userService.getSystemAccessToken();

                        console.log("Get Access Token By VALUE Result 1 ====> ", getSystemAccessTokenResult);

                        SystemAccessToken = getSystemAccessTokenResult.VALUE;
                    } else {
                        console.log("Get Access Token By phone number id Result ====> ", getSystemAccessTokenResult);

                        SystemAccessToken = getSystemAccessTokenResult.access_token;
                    }


                } else {
                    const getSystemAccessTokenResult = await userService.getSystemAccessToken();

                    console.log("Get Access Token By VALUE Result 2 ====> ", getSystemAccessTokenResult);

                    SystemAccessToken = getSystemAccessTokenResult.VALUE;
                }

                result1 = await userService.getusersdetails(userid, wanumber);

                if (result1 != undefined && result1 != null && result1.length > 0) {

                    //geting url from meta api
                    let mediaUrl = await whatsappService.getMediaUrl(mediaid, SystemAccessToken);

                    const buf = Buffer.from(mediaUrl.data);
                    let data = JSON.parse(buf);
                    let url = data.url;
                    //download media from url 
                    let downloadMedia = await whatsappService.downloadCloudMedia(url, SystemAccessToken);

                    res.header('Content-Type', downloadMedia.headers['content-type']);
                    res.send(Buffer.from(downloadMedia.data));
                }

            } else {
                return {
                    code: '100',
                    status: 'FAILED',
                    message: 'Invalid Wanumber',
                    data: {}
                };
            }

        }
    } catch (error) {

        errorLogger.error(JSON.stringify(error.response.data));
        res.status(error.response.status).send(error.response ? error.response.data : error);
    }
};