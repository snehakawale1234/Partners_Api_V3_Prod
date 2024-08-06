const user = require('../../services/v3/user');
const userService1 = require('../../services/v3/userStat');
const whatsappService = require('../../services/v3/whatsapp');
let queryString = require('query-string');
var appLoggers = require('../../apploggerV3.js');
var errorLogger = appLoggers.errorLogger;
var infoLogger = appLoggers.infoLogger;

module.exports = async (req, res) => {

    try {
        console.log("======= inside get all template =====");
        let apikey = req.headers.apikey;
        let wabaid = req.params.wabaid;

        console.log(apikey, wabaid);

        const { status } = req.query;
        let query1 = queryString.stringify(req.query);
        let access_token;
        if (!req.headers.apikey) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'apikey is required as parameter in header',
                data: {}
            };
        }
        if (!req.params.wabaid) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'wabaid is required as parameter in URL',
                data: {}
            };
        }
        //validate api key
        const selectapikeyResult = await user.selectapikeyByWabaId(apikey);

        console.log("selectapikeyResult", selectapikeyResult[0][0]);

        if (selectapikeyResult[0][0] == undefined) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'Invalid API Key',
                data: {}
            };
        }


        let getusersv3 = await userService1.getUserId(apikey, wabaid);

        if (getusersv3[0][0] === undefined) {

            return res.send({
                code: 100,
                status: "failed",
                message: "Invalid template of the user"
            });
        } else {
            //getting system access token
            const selectWabaIdResult = await user.selectwabaId(wabaid);
            console.log("Select WabaId Result ====> ", selectWabaIdResult[0][0]);
            //getting access token
            if (selectWabaIdResult[0][0].c == 1) {
                const getSystemAccessTokenResult = await user.getAccessTokenByWabaId(wabaid);

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
            //meta api called
            let get_template1result = await whatsappService.get_template1(objData, wabaid, stringified);


            if (get_template1result.response != undefined) {

                infoLogger.info(JSON.stringify(get_template1result.response.data.error));
                return res.status(200).send(
                    get_template1result.response.data.error,
                );
            } else {

                infoLogger.info(JSON.stringify(get_template1result.data));
                console.log("get_template1result.data==================", JSON.stringify(get_template1result.data));
                return res.status(200).send(
                    get_template1result.data,
                );
            }

        }
    } catch (error) {
        errorLogger.error(JSON.stringify(error.message));
        return res.status(500).send(error.message);
    }

};
