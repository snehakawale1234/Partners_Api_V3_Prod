const dbpool = require('../../db/database.js');
const async = require('async');
const user = require('../../services/v3/user.js');
const whatsappService = require('../../services/v3/whatsapp.js');
const userService1 = require('../../services/v3/userStat.js');
let buss_domain_url = process.env.buss_domain_url;
let axios = require('axios');
let queryString = require('query-string');
const utils = require('../../utils/bot.js');
const { json } = require('express');
var appLoggers = require('../../apploggerV3.js');
var errorLogger = appLoggers.errorLogger;
var infoLogger = appLoggers.infoLogger;

const getallownedWaba_1 = async (req, res) => {
    try {
        let accessToken = req.headers['access_token'];
        console.log("==============>", accessToken);
        let bmid = req.params.bmid;
        console.log("============>", bmid);
        let limit = req.query.limit != undefined ? req.query.limit : null;
        let after = req.query.after != undefined ? req.query.after : null;
        let before = req.query.before != undefined ? req.query.before : null;
        let apiUrl = bmid + "/owned_whatsapp_business_accounts";

        if (!accessToken) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'Access_token is required as parameter in header',
                data: {}
            };
        }
        if (!req.params.bmid) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'bmid is required as parameter in URL',
                data: {}
            };
        }

        console.log("procided get templte");

        let queryParameters = [];

        if (limit) {
            queryParameters.push(`limit=${limit}`);
        }
        if (after) {
            queryParameters.push(`after=${after}`);
        }
        if (before) {
            queryParameters.push(`before=${before}`);
        }

        if (queryParameters.length > 0) {
            apiUrl += '?' + queryParameters.join('&');
        }

        let response = await whatsappService.getallwabaapi(accessToken, apiUrl);
        // console.log("batchapicall --------------------------------->", batchapicall.data)
        if (response.status == 200) {

            // let url = "https://graph.facebook.com/v20.0"
            if (response.data.paging.next) {
                response.data.paging.next = response.data.paging.next.replace("https://graph.facebook.com/v20.0", buss_domain_url);
                // console.log("inside the if--------------------->", url)

            }
            if (response.data.paging.previous) {

                response.data.paging.previous = response.data.paging.previous.replace("https://graph.facebook.com/v20.0", buss_domain_url);



                console.log("inside the else--------------------->", response.data.paging.previous);
            }
            // console.log("============response", response.data);

            return res.send(
                response.data
            );
        } else {
            let status = response.response.status != undefined ? response.response.status : null;
            if (status != null) {
                return res.status(status).send(
                    response.response.data
                );
            } else {
                res.status(400).send({
                    code: 'WA100',
                    status: 'FAILED',
                    message: 'Something went wrong',
                    data: {}
                });
            }

        }



    } catch (error) {
        return res.send(error.message);
    }

};

const GetBusinessProfileId_1 = async (req, res) => {
    try {

        let accessToken = req.headers['access_token'];
        console.log("==============>", accessToken);
        let PhoneNumberId = req.params.PhoneNumberId;
        let query1 = queryString.stringify(req.query);

        if (!accessToken) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'accessToken required in header',
                data: {}
            };
        }

        let apiUrl = `${PhoneNumberId}/whatsapp_business_profile`;
        let queryParameters = [];

        if (query1) {
            queryParameters.push(`${query1}`);
        }


        if (queryParameters.length > 0) {
            apiUrl += '?' + queryParameters.join('&');
        }


        let response = await whatsappService.sharedWabaInfo(accessToken, apiUrl);
        if (response.status == 200) {

            return res.status(200).send(
                response.data
            );

        } else {

            let status = response.response.status != undefined ? response.response.status : null;
            if (status != null) {
                return res.status(status).send(
                    response.response.data
                );
            } else {
                res.status(400).send({
                    code: 'WA100',
                    status: 'FAILED',
                    message: 'Something went wrong',
                    data: {}
                });
            }
        }
    } catch (error) {
        res.status(500).send({
            code: 'WA100',
            status: 'FAILED',
            message: error.message || 'Invalid Request',
            data: {}
        });
    }
};




module.exports = { getallownedWaba_1, GetBusinessProfileId_1 }

