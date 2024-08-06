
const dbpool = require('../../db/database');
const async = require('async');
const sendService = require('../../services/v3/send');
let axios = require('axios');

module.exports = async (req, res) => {
    try {
        let wanumber = null;
        let apikey = req.headers.apikey;
        let phoneid = req.params.phonenoid;
        let fetchwebhookurlresult = null;
        let selectapikeyResult = null;
        let getWanumberResult = null;
        try {
            selectapikeyResult = await sendService.selectapikey(apikey);

        } catch (error) {
            res.status(500).send({
                code: '500',
                status: 'FAILED',
                message: 'Internal server error',
                data: {}
            });
        }

        if (selectapikeyResult[0][0].c == 0) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'Authentication failed',
                data: {}
            };
        }


        try {
            getWanumberResult = await sendService.getwanumber(phoneid);


        } catch (error) {
            res.status(500).send({
                code: '500',
                status: 'FAILED',
                message: 'Internal server error',
                data: {}
            });
        }
        if (getWanumberResult.length == 0) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'Authentication failed',
                data: {}
            };
        }

        wanumber = getWanumberResult[0].wanumber;


        try {
            fetchwebhookurlresult = await sendService.fetchwebhookurl(wanumber, apikey);
        } catch (error) {
            res.status(500).send({
                code: '500',
                status: 'FAILED',
                message: 'Internal server error',
                data: {}
            });
        }
        if (fetchwebhookurlresult.length == 0) {
            res.status(500).send({
                code: '500',
                status: 'FAILED',
                message: 'Internal server error',
                data: {}
            });
        }
        console.log({
            webhook_url: fetchwebhookurlresult[0][0].custom_callback,
            headers: JSON.parse(fetchwebhookurlresult[0][0].custom_parameters),
        });
        res.send({
            webhook_url: fetchwebhookurlresult[0][0].custom_callback,
            headers: JSON.parse(fetchwebhookurlresult[0][0].custom_parameters),
        });
    } catch (error) {

        res.status(500).send(error);

    }

};