require('dotenv').config();
const user = require('../../services/v3/user');
const whatsappService = require('../../services/v3/whatsapp');
const userService = require('../../services/v3/userStat');
var appLoggers = require('../../apploggerV3.js');
var errorLogger = appLoggers.errorLogger;
var infoLogger = appLoggers.infoLogger;

module.exports = async (req, res) => {
    try {
        let name = null;
        let updname = null;
        let updcategories = null;
        let categories = null;
        let apikey = req.headers.apikey;
        let id = req.params.id;
        let body = req.body;
        name = req.body.name;
        categories = req.body.categories;
        let getFlowData = null;
        let userid;
        let wabaid;
        let obj = {};


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
                message: 'wabaid is required as parameter in URL',
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

                let access_token = getSystemAccessTokenResult.VALUE;

                try {

                    getFlowData = await userService.getFlowData(id);

                } catch (error) {
                    return res.status(401).send({
                        code: 100,
                        status: "failed",
                        message: "Internal server error"
                    });
                }
                if (getFlowData.length > 0) {
                    updname = getFlowData[0].name;
                    updcategories = getFlowData[0].category;
                    wabaid = getFlowData[0].wabaid;

                }
                else {
                    return res.send({
                        code: 100,
                        status: "failed",
                        message: "Flow not found"
                    });
                }
                let getusersv3 = await userService.getUserId(apikey, wabaid);

                // let getusersv3 = await userService1.getUserIdbyPhno(apikey, id);

                if (getusersv3[0][0] == undefined) {
                    return res.status(401).send({
                        code: 100,
                        status: "failed",
                        message: "Flow not found for the user"
                    });
                }
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

                let apiu = 'v18.0/' + id;
                let objData = {
                    access_token,
                    body
                };


                let send_templateresult = await whatsappService.createFlowV3(objData, apiu);


                if (send_templateresult.status === 200) {

                    if (!req.body.name) {
                        updcategories = categories;
                    } else if (!req.body.categories) {
                        updname = name;
                    } else {
                        updname = name;
                        updcategories = categories;
                    }


                    await userService.updateWhatsappMetadata(updname, updcategories, id);

                    infoLogger.info(JSON.stringify(send_templateresult.data));
                    return res.status(200).send(
                        send_templateresult.data
                    );
                } else {

                    let status = send_templateresult.response.status;
                    infoLogger.info(JSON.stringify(send_templateresult.response.data));

                    return res.status(status).send(
                        send_templateresult.response.data
                    );
                }
            }
        };

    } catch (error) {

    }
};
