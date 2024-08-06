const sendService = require('../../services/v3/userStat');
var appLoggers = require('../../apploggerV3.js');
var errorLogger = appLoggers.errorLogger;
var infoLogger = appLoggers.infoLogger;

module.exports = async (req, res) => {
    try {
        if (!req.headers.apikey) {
            res.status(401).send({
                code: 100,
                status: "failed",
                error: "Api key is required"
            });
        }
        const apiKey = req.headers.apikey;
        //get userid from api key
        const userid = await sendService.getUserIdbyapikey(apiKey);
        if (userid[0][0] === undefined) {
            return res.status(401).send({
                code: 100,
                status: "failed",
                message: "Authentication Failed"
            });
        }

        if (userid != undefined) {
            //getting user details from userid
            const UserDetails = await sendService.getPhoneid(userid);

            if (UserDetails != undefined) {
                infoLogger.info(JSON.stringify(UserDetails));
                console.log("UserDetails=================", JSON.stringify(UserDetails));
                res.send({
                    code: 200,
                    status: 'SUCCESS',
                    data: UserDetails
                });
            }
            else {
                res.status(401).send({
                    code: 100,
                    status: "failed",
                    error: "Enter valid api key"
                });
            }
        }
        else {
            res.status(401).send({
                code: 100,
                status: "failed",
                error: "Enter valid api key"
            });
        }



    } catch (error) {
        errorLogger.error(JSON.stringify(error.message));
        return res.status(500).send(error.message);
    }


};
