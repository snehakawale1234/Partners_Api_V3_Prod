

const userService = require('../../services/v3/user');
const userStat = require('../../services/v3/userStat');
const whatsappService = require('../../services/v3/whatsapp');
var appLoggers = require('../../apploggerV3.js');
var errorLogger = appLoggers.errorLogger;
var infoLogger = appLoggers.infoLogger;

module.exports = async (req, res) => {
    try {

        let apikey = req.headers.apikey;
        let flowid = req.params.id;
        let deleteflowsResult;


        if (!req.params.id) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'flowid is required as parameter in URL',
                // data: []
            };
        }

        let selectapikeyResult = await userService.selectapikey(apikey);

        if (selectapikeyResult[0][0].c <= 0) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'Authentication failed',
                data: {}
            };
        }
        let wabaid = await userStat.getFlowData(flowid);
        console.log('=======wabaid====', wabaid);
        if (wabaid.length == 0) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'Flow not found',
                data: {}
            };
        }
        let getusersv3 = await userStat.getUserId(apikey, wabaid[0].wabaid);
        if (getusersv3[0][0] == undefined) {
            return res.status(401).send({
                code: 100,
                status: "failed",
                message: "Authentication Failed"
            });
        }
        try {
            const selectWabaIdResult = await userService.selectwabaId(wabaid[0].wabaid);
            console.log("Select WabaId Result ====> ", selectWabaIdResult[0][0]);
            if (selectWabaIdResult[0][0].c == 1) {
                const getSystemAccessTokenResult = await userService.getAccessTokenByWabaId(wabaid[0].wabaid);

                if (!getSystemAccessTokenResult.access_token || getSystemAccessTokenResult.access_token.length === 0) {
                    const getSystemAccessTokenResult = await userService.getSystemAccessToken();
                    console.log("Get Access Token By VALUE Result 1 ====> ", getSystemAccessTokenResult);
                    access_token = getSystemAccessTokenResult.VALUE;
                } else {
                    console.log("Get Access Token By Wabaid Result ====> ", getSystemAccessTokenResult);
                    access_token = getSystemAccessTokenResult.access_token;
                }
            } else {
                const getSystemAccessTokenResult = await userService.getSystemAccessToken();
                console.log("Get Access Token By VALUE Result 2 ====> ", getSystemAccessTokenResult);
                access_token = getSystemAccessTokenResult.VALUE;
            }

        } catch (error) {
            errorLogger.error(JSON.stringify(error.message));
            res.status(500).send({
                code: '500',
                status: 'FAILED',
                message: 'Internal server error',
                data: {}
            });
        }

        try {
            console.log(access_token);
            deleteflowsResult = await whatsappService.deleteMedia(flowid, access_token);
            console.log("================>", deleteflowsResult.status);

        } catch (error) {
            res.status(error.response.status).send(error.response ? error.response.data : error);
        }

        if (deleteflowsResult.status == 200) {

            await userStat.UpdateWhatsappFlowStatustoDelete(flowid);
            infoLogger.info(JSON.stringify(deleteflowsResult.data));
            res.send(deleteflowsResult.data);
        }


    } catch (error) {
        errorLogger.error(JSON.stringify(error.message));

        res.status(500).send({
            code: '500',
            status: 'FAILED',
            message: error.message,
            data: {}
        });

    }
};