
const user = require('../../services/v3/user');
const whatsappService = require('../../services/v3/whatsapp');
const userService1 = require('../../services/v3/userStat');
let queryString = require('query-string');
var appLoggers = require('../../apploggerV3.js');
var errorLogger = appLoggers.errorLogger;
var infoLogger = appLoggers.infoLogger;

module.exports = async (req, res) => {

    try {

        console.log("=========== inside delete template ============");


        let apikey = req.headers.apikey;
        let wabaid = req.params.id;
        const { name, hsm_id } = req.query;
        let query1 = queryString.stringify(req.query);
        let userid = null;
        let status12 = null;
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
                message: 'wabaid is required as parameter in URL',
                data: {}
            };
        }
        //validating api key
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

            const selectWabaIdResult = await user.selectwabaId(wabaid);
            console.log("Select WabaId Result ====> ", selectWabaIdResult[0][0]);

            if (selectWabaIdResult[0][0].c == 1) {
                //getting  waba id by access token 
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
                //getting system token
                const getSystemAccessTokenResult = await user.getSystemAccessToken();
                console.log("Get Access Token By VALUE Result 2 ====> ", getSystemAccessTokenResult);
                access_token = getSystemAccessTokenResult.VALUE;
            }


            //meta api called
            let deletetemplate = await whatsappService.deleteTemplate(access_token, wabaid, query1);
            if (!deletetemplate.response) {
                let getusersv3 = await userService1.getUserId(apikey, wabaid);

                userid = getusersv3[0][0].userid;

                let DeleteTemplateDetails = await user.DeleteTemplateDetails(name, userid);

                console.log("Template Deleted Successfully DeleteTemplateDetails ============================", DeleteTemplateDetails);


                status12 = deletetemplate.status;
                infoLogger.info(JSON.stringify(deletetemplate.data));
                return res.status(status12).send(
                    deletetemplate.data
                );
            } else {

                status12 = deletetemplate.response.status;
                infoLogger.info(JSON.stringify(deletetemplate.response.data));
                console.log("Template Deleted Successfully deletetemplateResponse============================", JSON.stringify(deletetemplate.response.data));
                return res.status(status12).send(
                    deletetemplate.response.data
                );

            }


        }
    } catch (error) {
        errorLogger.error(JSON.stringify(error.message));
        return res.status(500).send(error.message);
    }

};
