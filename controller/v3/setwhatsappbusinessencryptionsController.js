const whatsappService = require('../../services/v3/whatsapp');
const userService = require('../../services/v3/userStat');
const sendService = require('../../services/v3/send');
const user = require('../../services/v3/user');
const util = require('util');
const fs = require('fs');
const async = require('async');
// var appLoggers = require('../../applogger.js');
const wabot_db = require('../../db/database');
const { log } = require('console');
// var errorLogger = appLoggers.errorLogger;

//Create template api on whatsapp bussiness account
var appLoggers = require('../../apploggerV3.js');
var errorLogger = appLoggers.errorLogger;
var infoLogger = appLoggers.infoLogger;
const { generateKeyPair } = require('crypto');
const generateKeyPairAsync = util.promisify(generateKeyPair);

module.exports = async (req, res) => {
    try {
        let apikeys = req.headers.apikey;
        let phoneid = req.params.phoneid;
        let userid;

        if (!apikeys) {
            return res.send({
                code: 'WA001',
                status: 'FAILED',
                message: 'API Key is required',
                data: {}
            });
        }

        if (!phoneid) {
            return res.send({
                code: '100',
                status: 'FAILED',
                message: 'phoneid is required',
                data: {}
            });
        }

        // Retrieve phone number ID
        getWanumberResult = await sendService.getwanumber(phoneid);

        if (getWanumberResult.length == 0) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'Authentication failed',
                data: {}
            };
        }

        wanumber = getWanumberResult[0].wanumber;


        fetchuseridResult = await sendService.fetchuserid(wanumber, apikeys);

        if (fetchuseridResult[0].length == 0) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'Correct Api key is required',
                data: {}
            };
        }

        userid = fetchuseridResult[0][0].userid;
        console.log({ apikeys, wanumber });

        let getWabaId = await sendService.getWabaId(userid, wanumber);
        if (getWabaId[0].length == 0) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'Wabaid not found',
                data: {}
            };
        }
        console.log("=========>getWabaId", getWabaId[0][0].whatsapp_business_account_id);
        let wabaid = getWabaId[0][0].whatsapp_business_account_id;

        const selectWabaIdResult = await user.selectwabaId(wabaid);
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

        let checkBussinessKey = await user.checkwabaBusinessPublicKey(phoneid);

        if (checkBussinessKey[0][0].c === 1) {
            const publicKeyResult = await user.GetpublicKeyfromdb(phoneid);
            const publicKey = publicKeyResult[0][0].business_public_key;
            let result = await whatsappService.SetBusinessPublicKey(access_token, phoneid, publicKey);
            if (result.status == 200) {
                return res.send(
                    result.data
                );
            } else {
                let status = result.response.status;
                infoLogger.info(JSON.stringify(send_templateresult.response.data));
                console.log("response:================================", (JSON.stringify(send_templateresult.response.data)));
                return res.status(status).send(
                    result.response.data
                );
            }
        } else {
            try {
                //generating public
                const { publicKey, privateKey } = await generateKeyPairAsync('rsa', {
                    modulusLength: 2048,
                    publicKeyEncoding: { type: 'spki', format: 'pem' },
                    privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
                });
                console.log("Public and private keys generated");
                console.log({ publicKey, privateKey });

                let result = await whatsappService.SetBusinessPublicKey(access_token, phoneid, publicKey);
                console.log("=======result", result.data);
                if (result.status == 200) {
                    try {
                        let insertStatus = await user.SetBusinessPublicKeyStatus(wabaid, userid, publicKey, privateKey, phoneid, wanumber);
                    } catch (error) {
                        return res.send({
                            code: '100',
                            status: 'failed',
                            message: 'something went wrong'
                        });
                    }
                    return res.send(
                        result.data
                    );
                } else {
                    let status = result.response.status;
                    infoLogger.info(JSON.stringify(send_templateresult.response.data));
                    console.log("response:================================", (JSON.stringify(send_templateresult.response.data)));
                    return res.status(status).send(
                        result.response.data
                    );
                }
            } catch (error) {
                console.log('error=============', error);
                return res.send({
                    code: '100',
                    status: 'failed',
                    message: error
                });
            }
        }
    } catch (error) {
        errorLogger.error(JSON.stringify(error.message));
        res.status(500).send({
            code: 'WA100',
            status: 'FAILED',
            message: error.message || 'Invalid Request',
            data: {}
        });
    }
};

