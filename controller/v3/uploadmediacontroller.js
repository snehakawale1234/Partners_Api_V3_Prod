
const userService = require('../../services/v3/user');
const userService1 = require('../../services/v3/userStat');
var fs = require('fs');
var FormData = require('form-data');
var mime = require('mime-types');
const utils = require('../../utils/botv3');
var appLoggers = require('../../apploggerV3.js');
var errorLogger = appLoggers.errorLogger;
var infoLogger = appLoggers.infoLogger;

module.exports = async (req, res) => {
    try {

        let token = null;
        let apikey = req.headers.apikey;
        let FilePath = req.files && req.files.sheet ? req.files.sheet[0].path : null;
        let phoneid = req.params.phoneid;
        let wanumber = null;

        if (!FilePath || FilePath.length === 0) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'Please select file path',
                data: {}
            };
        }

        let wanumber1 = await userService.getWanumber(phoneid);

        if (!wanumber1 || wanumber1.length === 0) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'Invalid phone number Id',
                data: {}
            };
        }

        let wanumber1Str = wanumber1.wanumber.toString();

        if (wanumber1Str.startsWith("+")) {
            wanumber = wanumber1Str.substring(1);
        }
        wanumber = parseInt(wanumber, 10); // Convert to integer

        let selectapikeyResult = await userService.selectapikeyByPhoneId(apikey);

        if (selectapikeyResult[0][0] == undefined) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'Invalid API Key',
                data: {}
            };
        }
        let getUserIdbyPhnov3 = await userService1.getUserIdbyPhno(apikey, phoneid);

        if (getUserIdbyPhnov3[0][0] === undefined) {

            return res.send({
                code: 100,
                status: "failed",
                message: "Invalid Api Key of the user",
            });
        }
        //validating api key
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

        if (fetchmediausersdetailsResult[0][0] == undefined) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'Invalid media user details',
                data: {}
            };
        }

        let data = new FormData();

        let phone_number_id = fetchmediausersdetailsResult[0][0].phone_number_id;
        console.log("==============>", fetchmediausersdetailsResult[0][0].phone_number_id);
        let userid = fetchmediausersdetailsResult[0][0].userid;

        let result1 = null;
        if (phone_number_id != null && phone_number_id != undefined) {

            const selectPhoneNumberIdResult = await userService.selectPhoneNumberId(phoneid);

            try {
                if (selectPhoneNumberIdResult[0][0].c === 1) {
                    const getSystemAccessTokenResult = await userService.getAccessTokenByPhoneNumberID(phoneid);
                    console.log(getSystemAccessTokenResult.access_token);
                    if (!getSystemAccessTokenResult.access_token || getSystemAccessTokenResult.access_token.length === 0) {
                        const systemAccessTokenResult = await userService.getSystemAccessToken();
                        console.log("Get Access Token By VALUE Result 1 ====> ", systemAccessTokenResult);
                        token = systemAccessTokenResult.VALUE;
                    } else {
                        console.log("Get Access Token By Wabaid Result ====> ", getSystemAccessTokenResult);
                        token = getSystemAccessTokenResult.access_token;
                    }

                } else {

                    const systemAccessTokenResult = await userService.getSystemAccessToken();
                    console.log("Get Access Token By VALUE Result 2 ====> ", systemAccessTokenResult);
                    token = systemAccessTokenResult.VALUE;
                }
            } catch (error) {
                console.error("An error occurred: ", error);
            }


            result1 = await userService.getusersdetails(userid, wanumber);

            if (result1 != undefined && result1 != null && result1.length > 0) {

                data.append('file', fs.createReadStream(FilePath));
                data.append('messaging_product', 'whatsapp');

            }

        } else {
            result1 = await userService.getusersdetails(userid, wanumber);
            if (result1 != undefined && result1 != null && result1.length > 0) {
                let data = fs.createReadStream(FilePath);
            }
        }

        let FileType = (mime.lookup(FilePath));
        let filename = FilePath.split('/');
        let tmpFileName = filename[filename.length - 1] != undefined ? filename[filename.length - 1] : null;
        let mediatype = 0;

        let waurl = result1[0][0].waurl;

        waurl = waurl.substring(0, waurl.lastIndexOf("/"));


        const apiHeaders = [{
            'headerName': 'Authorization',
            'headerVal': 'Bearer ' + token
        },
        {
            'headerName': 'Content-Type',
            'headerVal': FileType,
        }
        ];

        if (FileType.includes('application')) {
            mediatype = 0;
        }
        else if (FileType.includes('image')) {
            mediatype = 1;
        }
        else if (FileType.includes('video')) {
            mediatype = 2;
        }
        else if (FileType.includes('audio')) {
            mediatype = 3;
        }

        let response;
        try {
            //meta api called

            response = await utils.uploadWhatsappMediaCloud(waurl, data, apiHeaders);

        } catch (error) {

            res.send(error.response.data);
        }

        let result = response.id;
        //insert data into db
        await userService.insertMedia(result, mediatype, FilePath, tmpFileName, userid);
        infoLogger.info(JSON.stringify(response));
        console.log("response:============================", (JSON.stringify(response)));
        res.send({
            response

        });

    } catch (err) {
        console.log("err =========> ", err);
        res.send({
            code: '100',
            status: 'FAILED',
            message: err.message,
        });

    }

};
