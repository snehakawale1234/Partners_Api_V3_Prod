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
        console.log("=====inside get template by template id============");
        let apikey = req.headers.apikey;
        let id = req.params.id;
        const { status } = req.query;
        let query1 = queryString.stringify(req.query);
        let access_token;
        let domain_url = process.env.domain_url;

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
                message: 'id is required as parameter in URL',
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
                const getwabaidResult = await user.fetchWabaId(apikey);
                const wabaId = getwabaidResult;
                const selectWabaIdResult = await user.selectwabaId(wabaId);
                console.log("Select WabaId Result ====> ", selectWabaIdResult[0][0]);
                //getting access token
                if (selectWabaIdResult[0][0].c === 1) {
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
                //get template meta api called
                let get_template1result = await whatsappService.get_template2(objData, id, stringified);
                if (!get_template1result.response) {

                    if (!get_template1result.url) {

                    }
                    else {
                        //getting url according to current system
                        let url = get_template1result.url;
                        const splitUrl = url.split("?");
                        let split_2 = splitUrl[1];

                        //let split_1 = `http://43.205.164.201:2707/v3/whatsapp_business/attachments/?${split_2}`;


                        let split_1 = `${domain_url}${split_2}`;

                        get_template1result.url = split_1;
                        infoLogger.info(JSON.stringify(get_template1result));
                        return res.status(200).send(
                            get_template1result,
                        );
                    }
                    return res.status(200).send(
                        get_template1result,
                    );
                } else {

                    infoLogger.info(JSON.stringify(get_template1result.response.data));
                    console.log("get_template1result.response.data======================", JSON.stringify(get_template1result.response.data));
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
