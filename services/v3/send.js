const dbpool = require("../../db/database");
const botUtils = require("../../utils/bot");
const mdbConnection = require('../../db/mongoose');
fetchphonenumberid = async (wanumber) => {
    try {
        let query =
            "Select count(1) as c from ezb_wa_msg_settings where wanumber = ? and phone_number_id is not null";
        let values = ["+" + wanumber];
        let rows = await dbpool.query(query, values);
        return rows;
    } catch (err) {
        return err;
    }
};

templatetitleuseridFlows = async (temptitle, userid) => {
    try {
        let query =
            "Select * from ezb_wa_templates_flows where temptitle = ? and userid = ?;";
        let values = [temptitle, userid];
        let rows = await dbpool.query(query, values);
        return rows[0];
    } catch (err) {
        return err;
    }
};
templatetitleuseridFlows1 = async (
    temptitle,
    whatsapp_business_account_id
) => {
    try {
        let query =
            "Select * from ezb_wa_templates_flows where temptitle = ? and whatsapp_business_account_id = ?;";
        let values = [temptitle, whatsapp_business_account_id];
        let rows = await dbpool.query(query, values);
        return rows[0];
    } catch (err) {
        return err;
    }
};
selectapikey = async (apikey) => {
    try {
        let query = "Select count(1) as c from ezb_wa_api_keys where apikey = ?";
        let values = [apikey];
        let rows = await dbpool.query(query, values);
        return rows;
    } catch (err) {
        return err;
    }
};

selectwanumber = async (wanumber) => {
    try {
        let query =
            "Select count(1) as c from ezb_wa_msg_settings where wanumber = ?";
        let values = ["+" + wanumber];

        let rows = await dbpool.query(query, values);
        return rows;
    } catch (err) {
        return err;
    }
};

countaccesstoken = async (wanumber) => {
    try {
        let query =
            "Select count(1) as c from ezb_wa_accesstoken where wanumber = ?";
        let values = ["+" + wanumber];
        let rows = await dbpool.query(query, values);
        return rows;
    } catch (err) {
        return err;
    }
};

fetchapikeywanumber = async (wanumber, apikey) => {
    try {
        let query =
            "select a.apikey, b.userid,b.waurl,b.wa_msg_setting_id,b.whatsapp_business_account_id,(select value from ezb_system_config where paramname  = 'ACCESS_TOKEN') AS authtoken," +
            " b.wanumber from ezb_wa_api_keys as a, ezb_wa_msg_settings as b " +
            " where a.userid = b.userid and b.wanumber = ? and a.apikey = ?;";
        let values = ["+" + wanumber, apikey];
        let rows = await dbpool.query(query, values);
        return rows;
    } catch (err) {
        return err;
    }
};



insertMessageInSentMasterAPI = async (id, userid, recipientnumber, objMsg, messageid, msgType, campaignid, wanumber, wa_msg_setting_id, direction, errorCode, errorDesc, clientPayload, bodycontent, fbtrace_id, category, categoryId, templateid) => {
    try {
        let query = "insert into ezb_message_sent_master(userid,mobileno,wabapayload,messageid,errcode,errdesc,createdt,status,readstatus,messagetype,source,campaignid,contactno,msg_setting_id,direction,client_payload, body_content,fbtrace_id, category, sessid, category_id,templateid)" +
            " values (?,?,?,?,?,?,NOW(),?,?,?,?,?,?,?,?,?,?,?,LOWER(?),MD5(?),?,?)";
        let values = [userid, recipientnumber, JSON.stringify(objMsg), messageid, errorCode, errorDesc, 0, 0, msgType, 1, 0, '+' + wanumber, wa_msg_setting_id, 1, JSON.stringify(objMsg), JSON.stringify(bodycontent), fbtrace_id, category, messageid, categoryId, templateid];
        let rows = await dbpool.query(query, values);
        return rows[0];
    }
    catch (err) {
        return err;
    }
};

// update sent master
updateMessageInSentMasterAPI = async (
    messageid,
    errcode,
    errdesc,
    fbtrace_id,
    insertId
) => {
    try {
        let query =
            "UPDATE ezb_message_sent_master SET messageid = ?, errcode = ?, errdesc = ?, fbtrace_id = ?, sessid = MD5(?) WHERE id = ?";
        let values = [messageid, errcode, errdesc, fbtrace_id, messageid, insertId];
        let rows = await dbpool.query(query, values);
        return rows;
    } catch (err) {
        return err;
    }
};

templatetitleuserid = async (temptitle, userid) => {
    try {
        let query =
            "Select * from ezb_wa_templates where temptitle = ? and userid = ?;";
        let values = [temptitle, userid];
        let rows = await dbpool.query(query, values);
        return rows;
    } catch (err) {
        return err;
    }
};

templatetitlewabaid = async (temptitle, whatsapp_business_account_id) => {
    try {
        let query =
            "select a.* from ezb_wa_templates as a left join ezb_wa_msg_settings as b on" +
            " a.userid = b.userid where a.temptitle = ? and b.whatsapp_business_account_id = ? LIMIT 1";
        let values = [temptitle, whatsapp_business_account_id];
        let rows = await dbpool.query(query, values);
        return rows;
    } catch (err) {
        return rows;
    }
};

templatetitlewabaid1 = async (
    temptitle,
    whatsapp_business_account_id
) => {
    try {
        let query =
            "select a.* from ezb_wa_templates_flows as a left join ezb_wa_msg_settings as b on" +
            " a.userid = b.userid where a.temptitle = ? and b.whatsapp_business_account_id = ? LIMIT 1";
        let values = [temptitle, whatsapp_business_account_id];
        let rows = await dbpool.query(query, values);
        return rows;
    } catch (err) {
        return rows;
    }
};

fetchuserid = async (wanumber, apikey) => {
    try {
        let query =
            "Select a.userid from ezb_wa_msg_settings as a, ezb_wa_api_keys as b " +
            "  where a.userid = b.userid and wanumber = ? and apikey = ?;";
        let values = [wanumber, apikey];
        let rows = await dbpool.query(query, values);
        return rows;
    } catch (err) {
        return err;
    }
};

fetchusernameuseridcustomcallback = async (wanumber, apikey) => {
    try {
        let query =
            "Select a.username,a.companyname,b.custom_callback from ezb_users as a, ezb_wa_msg_settings as b,ezb_wa_api_keys as c" +
            " where a.userid = b.userid and wanumber = ? and c.apikey = ?;";
        let values = ["+" + wanumber, apikey];
        let rows = await dbpool.query(query, values);
        return rows;
    } catch (err) {
        return err;
    }
};

fetchpartnersclients = async (wanumber) => {
    try {
        let query =
            "Select a.username,a.firstname,a.companyname,a.mobile,a.email,a.expirydate,a.lastupdatetime,a.auserid,a.euserid,b.wanumber  from ezb_users as a,ezb_wa_msg_settings as b" +
            " where a.userid = b.userid and a.userid = (Select userid from ezb_wa_msg_settings where wanumber = ?);";
        let values = ["+" + wanumber];
        let rows = await dbpool.query(query, values);
        return rows;
    } catch (err) {
        return err;
    }
};

fetchapikeyappid = async (wanumber) => {
    try {
        let query =
            "Select a.apikey, a.apikey_id,c.username from ezb_wa_api_keys as a, ezb_wa_msg_settings as b, ezb_users as c " +
            " where a.userid = b.userid and a.userid = c.userid and b.wanumber = ?;";
        let values = ["+" + wanumber];
        let rows = await dbpool.query(query, values);
        return rows;
    } catch (err) {
        return err;
    }
};

updateapikey = async (apikey, userid) => {
    try {
        let query = "Update ezb_wa_api_keys set apikey = ? where userid = ? ;";
        let values = [apikey, userid];
        let rows = await dbpool.query(query, values);
        return rows;
    } catch (err) {
        return err;
    }
};

getbalanceamt = async (wanumber) => {
    try {
        let query =
            "Select a.balance_amt,a.free_conversation from ezb_users as a, ezb_wa_msg_settings as b where a.userid = b.userid and wanumber = ?;";
        let values = ["+" + wanumber];
        let rows = await dbpool.query(query, values);
        return rows;
    } catch (err) {
        return err;
    }
};

getbicuicrate = async (wabaCountryCodeNumeric, userid) => {
    try {
        let wanumber;
        let query =
            "SELECT IFNULL((SELECT bic_rate FROM ezb_wa_customize_rate WHERE countrycode = ? AND userid = ?)," +
            " (SELECT bic_rate FROM ezb_wa_rate_master WHERE countrycode = ?)) AS bic_rate," +
            " IFNULL((SELECT uic_rate FROM ezb_wa_customize_rate WHERE countrycode = ? AND userid = ?)," +
            " (SELECT uic_rate FROM ezb_wa_rate_master WHERE countrycode = ?)) AS uic_rate";


        let values = [
            wabaCountryCodeNumeric,
            userid,
            wabaCountryCodeNumeric,
            wabaCountryCodeNumeric,
            userid,
            wabaCountryCodeNumeric,
        ];
        let rows = await dbpool.query(query, values);
        return rows;
    } catch (err) {
        return err;
    }
};

getlastrenewal = async (wanumber) => {
    try {
        let query =
            "Select ifnull(a.amt, ?) AS Amount, ifnull(MAX(a.transactiondate), ?) AS transactiondate  from ezb_billing_master as a, ezb_wa_msg_settings as b " +
            " where a.userid = b.userid and b.wanumber = ?;";
        let values = ["NA", "NA", "+" + wanumber];
        let rows = await dbpool.query(query, values);
        return rows;
    } catch (err) {
        return err;
    }
};

updateclient = async (
    firstname,
    mobile,
    email,
    companyname,
    wanumber,
    apikey
) => {
    try {
        let query =
            "Update ezb_wa_msg_settings as a, ezb_users as b, ezb_wa_api_keys as c set" +
            " b.firstname = ?, b.mobile = ?, b.email = ?, b.companyname = ? " +
            " where a.userid = b.userid and a.userid = c.userid and a.wanumber = ? and c.apikey = ?;";
        let values = [
            firstname,
            mobile,
            email,
            companyname,
            "+" + wanumber,
            apikey,
        ];
        let rows = await dbpool.query(query, values);
        return rows;
    } catch (err) {
        return err;
    }
};

// Function to validate access token
getAccessToken = async (accessTokenvalue) => {
    try {
        const query = "select paramname from `ezb_system_config` where value = ?";
        const value = [accessTokenvalue];
        const rows = await dbpool.query(query, value);
        return rows;
    } catch (err) {
        return err;
    }
};

getapikeybywanumber = async (wanumber) => {
    try {
        const query =
            "SELECT a.apikey FROM ezb_wa_api_keys AS a, ezb_wa_msg_settings AS b WHERE a.userid = b.userid AND b.wanumber = ?";
        const values = ["+" + wanumber];
        const rows = await dbpool.query(query, values);
        return rows;
    } catch (err) {
        return err;
    }
};


insertinwaaccesstoken = async (wanumber, token) => {
    try {
        let query =
            "Replace into ezb_wa_accesstoken(wanumber,accesstoken,expiresin) values(?,?,DATE_ADD(NOW(), INTERVAL 5 MINUTE));";
        let values = ["+" + wanumber, token];
        let rows = await dbpool.query(query, values);
        return rows;
    } catch (err) {
        return err;
    }
};

selectaccesstoken = async (wanumber) => {
    try {
        let query = "Select accesstoken from ezb_wa_accesstoken where wanumber = ?";
        let values = ["+" + wanumber];
        let rows = await dbpool.query(query, values);
        return rows;
    } catch (err) {
        return err;
    }
};

msgsettingdetails = async (wanumber) => {
    try {
        let query =
            "Select a.userid,a.wa_msg_setting_id,a.wanumber,a.islivechat,a.livechatwebhook,a.custom_callback,a.isactivepinbotflow,a.phone_number_id,a.pinnacle_api_url," +
            " b.apikey as authtoken,a.text_tps,a.media_tps" +
            " from ezb_wa_msg_settings as a , ezb_wa_api_keys as b" +
            " where a.userid = b.userid and a.wanumber = ?;";
        let values = ["+" + wanumber];
        let rows = await dbpool.query(query, values);
        return rows;
    } catch (err) {
        return err;
    }
};

getreplymessageforcallback = async (message, wanumber) => {
    try {
        let query =
            "SELECT auto_response, userid, hsmname, auto_response_flag, " +
            " (SELECT stopword FROM ezb_wa_msg_settings WHERE stopword IN (LOWER(?)) AND wanumber=M.wanumber) AS stopword," +
            " (SELECT unsubmsg FROM ezb_wa_msg_settings WHERE stopword IN (LOWER(?)) AND wanumber=M.wanumber) AS unsubmsg," +
            " (SELECT resubword FROM ezb_wa_msg_settings WHERE resubword IN (LOWER(?)) AND wanumber=M.wanumber) AS resubword," +
            " (SELECT resubmsg FROM ezb_wa_msg_settings WHERE resubword IN (LOWER(?)) AND wanumber=M.wanumber) AS resubmsg" +
            " FROM ezb_wa_msg_settings AS M" +
            " WHERE wanumber LIKE ?";
        let values = [message, message, message, message, "+" + wanumber];
        let rows = await dbpool.query(query, values);

        return rows;
    } catch (err) {
        //
        return err;
    }
};

fetchaccesstoken = async () => {
    try {
        let query = "SELECT VALUE FROM ezb_system_config WHERE paramname = ?";
        let values = ["ACCESS_TOKEN"];
        let rows = await dbpool.query(query, values);
        return rows;
    } catch (err) {
        return err;
    }
};

checkSubscription = async (wanumber, wabanumber) => {
    try {
        let query =
            "SELECT subflag FROM ezb_subscription_master WHERE wanumber = ? AND wabanumber = ?";
        let values = [wanumber, "+" + wabanumber];
        let rows = await dbpool.query(query, values);

        return rows;
    } catch (err) {
        return err;
    }
};
insertMessageInSentMasterAPI1 = async (
    id,
    userid,
    recipientnumber,
    objMsg,
    messageid,
    msgType,
    campaignid,
    wanumber,
    wa_msg_setting_id,
    direction,
    errorCode,
    errorDesc,
    clientPayload,
    bodycontent,
    fbtrace_id,
    category,
    categoryId
) => {
    try {
        let query =
            "insert into ezb_message_sent_master(userid,mobileno,wabapayload,messageid,errcode,errdesc,createdt,status,readstatus,messagetype,source,campaignid,contactno,msg_setting_id,direction,client_payload, body_content,fbtrace_id, category, sessid, category_id)" +
            " values (?,?,?,?,?,?,NOW(),?,?,?,?,?,?,?,?,?,?,?,LOWER(?),MD5(?),?)";
        let values = [
            userid,
            recipientnumber,
            JSON.stringify(objMsg),
            messageid,
            errorCode,
            errorDesc,
            0,
            0,
            msgType,
            1,
            0,
            "+" + wanumber,
            wa_msg_setting_id,
            1,
            JSON.stringify(objMsg),
            JSON.stringify(bodycontent),
            fbtrace_id,
            category,
            messageid,
            categoryId,
        ];
        let rows = await dbpool.query(query, values);
        return rows[0];
    } catch (err) {
        console.log(err);
        return err;
    }
};
UserInfo = async (userid) => {
    try {
        let query = "SELECT * FROM ezb_users where userid = ?";
        let values = [userid];
        let rows = await dbpool.query(query, values);
        return rows[0];
    }
    catch (err) {
        return err;
    }
};
getwanumber = async (id) => {
    try {
        let query = "SELECT wanumber,wa_msg_setting_id FROM ezb_wa_msg_settings where phone_number_id = ?";
        let values = [id];
        let rows = await dbpool.query(query, values);
        return rows[0];
    }
    catch (err) {

        return err;
    }
};

insertPaymentRefundMaster = async (referenceId, refundamount, status, refundId, wanumber, payment_config_id, refundCurrency) => {
    try {
        let query = "INSERT INTO ezb_wa_payment_refund_master set  referenceid =?,amount =?,status =?,refundid= ?,wanumber=?,createdt=NOW(),payment_config_id =? ,currency=?";
        let values = [referenceId, refundamount, status, refundId, wanumber, payment_config_id, refundCurrency];
        let [result] = await dbpool.query(query, values);

        return result;
    }
    catch (err) {
        return err;
    }
};


let dynamicModelCreator = async (wabanumber, sentMasterSchema) => {
    try {

        if (wabanumber !== undefined && wabanumber !== null) {


            let dynamicSentMasterModel = '+' + wabanumber;
            //console.log({ dynamicSentMasterModel });

            const sentMasterModel = mdbConnection.model(dynamicSentMasterModel, sentMasterSchema);




            let temp = await sentMasterModel.find({ contactno: wabanumber });


            if (temp.length > 0) {

                return sentMasterModel;

            }
            else {

                return sentMasterModel;

            }
        }
        else {
            return false;


        }


    } catch (error) {
        console.log("dynamicModelCreator error ", error);
    }
};

updatewebhooks = async (custom_callback, custom_parameters, custom_callback_payload_flag, userid, wanumber) => {
    try {
        let query = "Update ezb_wa_msg_settings set custom_callback = ?,custom_parameters = ?,custom_callback_payload_flag=? where userid = ? and wanumber = ?;";
        let values = [custom_callback, JSON.stringify(custom_parameters), custom_callback_payload_flag, userid, wanumber];
        let rows = await dbpool.query(query, values);
        return rows;
    }
    catch (err) {
        return err;
    }
};


fetchwebhookurl = async (wanumber, apikey) => {
    try {
        let query = "Select a.custom_callback,a.custom_parameters,a.custom_callback_payload_flag from ezb_wa_msg_settings as a, ezb_wa_api_keys as b" +
            " where a.userid = b.userid and wanumber = ? and apikey = ?;";
        let values = [wanumber, apikey];
        let rows = await dbpool.query(query, values);
        return rows;
    }
    catch (err) {
        return err;
    }
};

insertcurrentdatetime = async (currentdatetime, mobileno, browser, os, campaignid, next) => {
    try {
        let query = "Insert into calltoaction_table(datetime,mobilenumber,browser,os,campaignid) values(?,?,?,?,?)";
        let values = [currentdatetime, mobileno, browser, os, campaignid];
        let rows = await dbpool.query(query, values);
        next(null, rows[0]);
    }
    catch (err) {
        console.log(err);
        next(err);
    }
};

const getWabaId = async (userid, wanumber) => {
    try {
        const query = 'SELECT whatsapp_business_account_id FROM `ezb_wa_msg_settings` WHERE userid =? AND wanumber=?';
        const value = [userid, wanumber];
        const rows = await dbpool.query(query, value);
        return rows;
    } catch (err) {
        return err;
    }
};




module.exports = {
    selectapikey,
    selectwanumber,
    countaccesstoken,
    fetchapikeywanumber,
    insertMessageInSentMasterAPI,
    updateMessageInSentMasterAPI,
    templatetitleuserid,
    fetchuserid,
    fetchusernameuseridcustomcallback,
    fetchpartnersclients,
    fetchapikeyappid,
    updateapikey,
    getbalanceamt,
    getbicuicrate,
    getlastrenewal,
    updateclient,
    getapikeybywanumber,
    getAccessToken,
    templatetitleuseridFlows,
    templatetitleuseridFlows1,
    insertinwaaccesstoken,
    selectaccesstoken,
    msgsettingdetails,
    fetchaccesstoken,
    getreplymessageforcallback,
    templatetitlewabaid1,
    templatetitlewabaid,
    fetchphonenumberid,
    checkSubscription,
    insertMessageInSentMasterAPI1,
    UserInfo,
    getwanumber,
    insertPaymentRefundMaster,
    dynamicModelCreator,
    updatewebhooks,
    fetchwebhookurl,
    insertcurrentdatetime,
    getWabaId
};
