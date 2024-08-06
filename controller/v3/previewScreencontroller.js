require('dotenv').config();
const dbpool = require('../../db/database');
const async = require('async');
const user = require('../../services/v3/user');
const whatsappService = require('../../services/v3/whatsapp');
const userService1 = require('../../services/v3/userStat');
let queryString = require('query-string');
var appLoggers = require('../../apploggerV3.js');
var errorLogger = appLoggers.errorLogger;
var infoLogger = appLoggers.infoLogger;

module.exports = async (req, res) => {
    try {
        console.log("inside preview screen controller=============");
        let apikey = req.headers.apikey;
        let id = req.params.id;
        const { status } = req.query;
        let query = queryString.stringify(req.query);
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
                message: 'flow is required as parameter in URL',
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
                let wabaid = await userService1.getFlowData(id);
                if (wabaid.length == 0) {
                    return {
                        code: '100',
                        status: 'FAILED',
                        message: 'Flow not found',
                        data: {}
                    };
                }
                let getusersv3 = await userService1.getUserId(apikey, wabaid[0].wabaid);
                if (getusersv3[0][0] == undefined) {
                    return res.status(401).send({
                        code: 100,
                        status: "failed",
                        message: "Authentication Failed"
                    });
                }
                //get access token
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

                let objData = {
                    access_token,
                };

                //get template meta api called

                let get_template1result = await whatsappService.get_template2(objData, id, query);
                console.log("=========>get_template1result", get_template1result);
                if (!get_template1result.response) {
                    res.send(
                        get_template1result
                    );

                } else {

                    infoLogger.info(JSON.stringify(get_template1result.response.data));
                    return res.status(get_template1result.response.status).send(
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
