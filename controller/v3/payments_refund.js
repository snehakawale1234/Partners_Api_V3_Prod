const user = require('../../services/v3/user');
const whatsappService = require('../../services/v3/whatsapp');
const userService1 = require('../../services/v3/userStat');
const send = require('../../services/v3/send');
var appLoggers = require('../../apploggerV3.js');
var errorLogger = appLoggers.errorLogger;
var infoLogger = appLoggers.infoLogger;


module.exports = async (req, res) => {
    try {
        let apikey = req.headers.apikey;
        let access_token = null;
        let id = req.params.id;
        let body1 = req.body;
        let wanumResult = null;
        let responceaxios;
        let resststus;


        //getting api key
        let selectapikeyResult = await user.selectapikeyByPhoneId(apikey);
        if (selectapikeyResult[0][0] == undefined) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'Invalid API Key',
                data: {}
            };
        }
        let getUserIdbyPhnov3 = await userService1.getUserIdbyPhno(apikey, id);

        if (getUserIdbyPhnov3[0][0] === undefined) {

            return res.send({
                code: 100,
                status: "failed",
                message: "Invalid Api Key of the user",
            });
        } else {

            const selectPhoneNumberIdResult = await user.selectPhoneNumberId(id);

            console.log("selectPhoneNumberIdResult  ====> ", selectPhoneNumberIdResult[0][0]);

            //getting access token
            if (selectPhoneNumberIdResult[0][0].c === 1) {
                const getSystemAccessTokenResult = await user.getAccessTokenByPhoneNumberID(id);

                if (!getSystemAccessTokenResult.access_token || getSystemAccessTokenResult.access_token.length === 0) {
                    const getSystemAccessTokenResult = await user.getSystemAccessToken();
                    console.log("Get Access Token By VALUE Result 1 ====> ", getSystemAccessTokenResult);
                    access_token = getSystemAccessTokenResult.VALUE;
                } else {
                    console.log("Get Access Token By phoneNumberId Result ====> ", getSystemAccessTokenResult);
                    access_token = getSystemAccessTokenResult.access_token;
                }

            } else {
                const getSystemAccessTokenResult = await user.getSystemAccessToken();
                console.log("Get Access Token By VALUE Result 2 ====> ", getSystemAccessTokenResult);
                access_token = getSystemAccessTokenResult.VALUE;
            }

            let objData = {
                access_token,
                body1
            };

            //meta api called
            let payments_refundresult = await whatsappService.payments_refund(objData, id);


            responceaxios = null;
            resststus = null;

            if (payments_refundresult.response != undefined) {

                responceaxios = payments_refundresult.response.data;
                resststus = payments_refundresult.response.status;




                return res.status(resststus).send(
                    responceaxios,
                );
            } else {
                const wanumberResult = await send.getwanumber(id);
                wanumResult = wanumberResult[0].wanumber.replace('+', '');
                responceaxios = payments_refundresult;


                let referenceId = req.body.reference_id;
                let refundamountFormat = req.body.amount.value / 100;
                let refundamount = refundamountFormat.toFixed(2);
                let refundCurrency = req.body.amount.currency;
                let payment_config_id = req.body.payment_config_id;
                let wanumber = wanumResult;
                let refundId = responceaxios.data.id;
                let status;
                if (responceaxios.data.status == "completed") {
                    status = 1;
                } else {
                    status = 0;
                }

                //insert details into db
                await send.insertPaymentRefundMaster(referenceId, refundamount, status, refundId, wanumber, payment_config_id, refundCurrency);


                infoLogger.info(JSON.stringify(responceaxios.data));
                console.log("response:=======================", (JSON.stringify(responceaxios.data)));
                return res.status(200).send(
                    responceaxios.data,
                );
            }


        }

    } catch (error) {
        errorLogger.error(JSON.stringify(error.message));
        return res.status(500).send(error.message);
    }

};
