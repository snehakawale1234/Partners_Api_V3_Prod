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
let buss_domain_url = process.env.buss_domain_url;

//Create template api on whatsapp bussiness account
var appLoggers = require('../../apploggerV3.js');
var errorLogger = appLoggers.errorLogger;
var infoLogger = appLoggers.infoLogger;
module.exports = async (req, res) => {
    try {

        let accessToken = req.headers['access_token'];
        console.log("==============>", accessToken);
        let bmid = req.params.bmid;
        let limit = req.query.limit != undefined ? req.query.limit : null;
        let after = req.query.after != undefined ? req.query.after : null;
        let before = req.query.before != undefined ? req.query.before : null;
        console.log({ bmid, limit, after });

        if (!accessToken) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'Access_token required in header',
                data: {}
            };
        }

        let apiUrl = `${bmid}/client_whatsapp_business_accounts`;
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

        let response = await whatsappService.sharedWabaInfo(accessToken, apiUrl);
        if (response.status == 200) {
            if (response.data.paging != undefined) {
                if (response.data.paging.next) {
                    response.data.paging.next = response.data.paging.next.replace(
                        'https://graph.facebook.com/v20.0',
                        buss_domain_url
                    );
                }
                if (response.data.paging.previous) {
                    response.data.paging.previous = response.data.paging.previous.replace(
                        'https://graph.facebook.com/v20.0',
                        buss_domain_url
                    );
                }
            }

            return res.status(200).send(
                response.data
            );
        } else {
            let status = response.response.status != undefined ? response.response.status : null;
            if (status != null) {
                console.log("response:================================", (JSON.stringify(response.response.data)));
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
}








