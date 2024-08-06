const dbpool = require('../../db/database');
const sendService = require('../../services/v3/send');
const axios = require('axios');

module.exports = async (req, res) => {
    try {
        console.log("==========>setwebhook", req.body);
        const apikey = req.headers.apikey;
        const phoneid = req.params.phonenoid;
        const custom_callback = req.body.webhook_url;
        const custom_parameters = req.body.headers;
        const custom_callback_payload_flag = 1;
        let selectapikeyResult = null;
        let getWanumberResult = null;
        let fetchuseridResult = null;
        let wanumber = null;
        let updatewebhooksResult = null;
        let userid = null;
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

        // Step 3: Fetch User ID

        try {

            fetchuseridResult = await sendService.fetchuserid(wanumber, apikey);

        } catch (error) {
            res.status(500).send({
                code: '500',
                status: 'FAILED',
                message: 'Internal server error',
                data: {}
            });
        }

        if (fetchuseridResult[0].length == 0) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'No user found',
                data: {}
            };
        }

        userid = fetchuseridResult[0][0].userid;
        // Step 4: Update Webhooks

        try {

            updatewebhooksResult = await sendService.updatewebhooks(custom_callback, custom_parameters, custom_callback_payload_flag, userid, wanumber);

        } catch (error) {
            res.status(500).send({
                code: '500',
                status: 'FAILED',
                message: 'Internal server error',
                data: {}
            });
        }
        if (!updatewebhooksResult) {
            res.status(500).send({
                code: '500',
                status: 'FAILED',
                message: 'Internal server error',
                data: {}
            });
        }



        res.send({
            code: '200',
            status: 'Success',
            message: 'Your webhook has been configured successfully'
        });

    } catch (err) {
        res.status(500).send(err);
    }
};
