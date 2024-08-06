
const user = require('../../services/v3/user');
const whatsappService = require('../../services/v3/whatsapp');
const userService1 = require('../../services/v3/userStat');
var appLoggers = require('../../apploggerV3.js');
var errorLogger = appLoggers.errorLogger;
var infoLogger = appLoggers.infoLogger;
module.exports = async (req, res) => {

    try {

        let apikey = req.headers.apikey;
        let phoneid = req.params.phoneid;

        if (!req.headers.apikey) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'apikey is required as parameter in header',
                data: {}
            };
        }
        if (!req.params.phoneid) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'Phone no id is required as parameter in URL',
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
                let getusersv3 = await userService1.getUserIdbyPhno(apikey, phoneid);

                if (getusersv3[0][0] == undefined) {
                    return res.status(401).send({
                        code: 100,
                        status: "failed",
                        message: "Authentication Failed / proper Phone no id "
                    });
                } else {
                    let checkKeySatus = await user.getPrivateKeyfromdb(phoneid);
                    if (checkKeySatus[0][0] != undefined && checkKeySatus[0][0].business_private_key != undefined) {
                        return res.send({
                            result: checkKeySatus[0][0].business_private_key
                        });

                    } else {
                        return res.send(
                            {
                                code: 100,
                                status: "failed",
                                message: "whatsapp business encryption keys not genrated "
                            }
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
    }

};