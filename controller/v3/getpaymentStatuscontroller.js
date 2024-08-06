
const user = require('../../services/v3/user');
const { performance } = require('perf_hooks');
const whatsappService = require('../../services/v3/whatsapp');
const userService1 = require('../../services/v3/userStat');
const sendService = require('../../services/v3/send');
const { json } = require('express');
let sentMasterSchema = require('../../model/sentMasterModel');
var appLoggers = require('../../apploggerV3.js');
let { v4: uuidv4 } = require('uuid');
const { tryEach } = require('async');
var errorLogger = appLoggers.errorLogger;
var infoLogger = appLoggers.infoLogger;



module.exports = async (req, res) => {

    try {
        let apikey = req.headers.apikey;
        let phoneid = req.params.phoneid;
        let payment_configuration = req.params.payment_configuration;
        let referenceid = req.params.referenceid;
        const startTime = performance.now();
        let sentMasterUUID = uuidv4();
        let uuid = uuidv4();
        let bizOpaqueCallbackData = {};
        if (!req.headers.apikey) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'apikey is required as parameter in header',
                data: {}
            };
        }
        if (!req.params.phoneid) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'phone number id is required as parameter in URL',
                data: {}
            };
        }
        if (!req.params.payment_configuration) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'payment configuration id is required as parameter in URL',
                data: {}
            };
        }
        if (!req.params.referenceid) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'referenceid id is required as parameter in URL',
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
                //getting access token
                const getSystemAccessTokenResult = await user.getSystemAccessToken();

                access_token = getSystemAccessTokenResult.VALUE;

                let getusersv3 = await userService1.getUserIdbyPhno(apikey, phoneid);

                if (getusersv3[0][0] == undefined) {
                    return res.status(401).send({
                        code: 100,
                        status: "failed",
                        message: "Authentication Failed"
                    });
                } else {
                    const selectPhoneNumberIdResult = await user.selectPhoneNumberId(phoneid);
                    //getting access token
                    if (selectPhoneNumberIdResult[0][0].c == 1) {
                        const getSystemAccessTokenResult = await user.getAccessTokenByPhoneNumberID(phoneid);

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

                    let apiu = '/v20.0/' + phoneid + '/payments/' + payment_configuration + '/' + referenceid;

                    let objData = {
                        access_token
                    };
                    let getPaymentres = await whatsappService.getPaymentStatus(objData, apiu);
                    if (getPaymentres.status == 200) {
                        return getPaymentres.data;
                    } else {
                        let status = getPaymentres.response.status;
                        return res.status(status).send(
                            getPaymentres.response.data
                        );
                    }

                }
            }
        }
    } catch (error) {
        errorLogger.error(JSON.stringify(error.message));
        return res.status(500).send(error.message);
    }

};