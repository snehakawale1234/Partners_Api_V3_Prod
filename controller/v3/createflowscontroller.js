
const user = require('../../services/v3/user');
const whatsappService = require('../../services/v3/whatsapp');
const userService = require('../../services/v3/userStat');
var appLoggers = require('../../apploggerV3.js');
var errorLogger = appLoggers.errorLogger;
var infoLogger = appLoggers.infoLogger;

module.exports = async (req, res) => {

    try {

        let apikey = req.headers.apikey;
        let id = req.params.id;
        let body = req.body;
        let name = req.body.name;
        let categories = req.body.categories;
        let userid;
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
                const selectWabaIdResult = await user.selectwabaId(id);
                console.log("Select WabaId Result ====> ", selectWabaIdResult[0][0]);
                //getting access token
                if (selectWabaIdResult[0][0].c == 1) {
                    const getSystemAccessTokenResult = await user.getAccessTokenByWabaId(id);

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

                let getusersv3 = await userService.getUserId(apikey, id);




                // let getusersv3 = await userService1.getUserIdbyPhno(apikey, id);

                if (getusersv3[0][0] == undefined) {
                    return res.status(401).send({
                        code: 100,
                        status: "failed",
                        message: "Authentication Failed"
                    });
                } else {
                    userid = getusersv3[0][0].userid;

                    let apiu = 'v18.0/' + id + '/flows';
                    let objData = {
                        access_token,
                        body
                    };
                    console.log({ objData });
                    let send_templateresult = await whatsappService.createFlowV3(objData, apiu);


                    if (send_templateresult.status === 200) {
                        console.log("============>id", send_templateresult.data.id);
                        await userService.insertWhatsappFlow(userid, id, name, categories, 0, send_templateresult.data.id);
                        infoLogger.info(JSON.stringify(send_templateresult.data));
                        return res.status(200).send(
                            send_templateresult.data
                        );
                    } else {

                        let ststus112 = send_templateresult.response.status;
                        infoLogger.info(JSON.stringify(send_templateresult.response.data));
                        console.log("response:================================", (JSON.stringify(send_templateresult.response.data)));
                        return res.status(ststus112).send(
                            send_templateresult.response.data
                        );

                    }


                }
            }
        }




    } catch (error) {
        errorLogger.error(JSON.stringify(error.message));
        return res.status(500).send(
            error.message
        );
        // return res.send(error.message);
    }

};