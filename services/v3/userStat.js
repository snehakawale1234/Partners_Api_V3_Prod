const wabot_db = require('../../db/database');
const {
    result
} = require('lodash');
const getApiKey = async () => {
    try {
        const query = 'SELECT `apikey` FROM `ezb_wa_api_keys` LIMIT 50';
        const rows = await wabot_db.query(query);
        return rows;
    } catch (err) {
        return err;
    }
};

const getUserId = async (apikeys, wabaid) => {
    try {

        const query = 'SELECT a.userid FROM ezb_wa_api_keys AS a , ezb_wa_msg_settings AS b WHERE a.userid = b.userid AND a.apikey = ? AND  b.whatsapp_business_account_id = ?';
        const value = [apikeys, wabaid];

        const rows = await wabot_db.query(query, value);

        return rows;
    } catch (err) {
        return err;
    }
};
const getUserIdbyapikey = async (apikeys) => {
    try {

        const query = 'SELECT userid FROM ezb_wa_api_keys where apikey = ?;';
        const value = [apikeys];

        const rows = await wabot_db.query(query, value);

        return rows;
    } catch (err) {
        return err;
    }
};
const getUserIdbyPhno = async (apikeys, wabaid) => {
    try {

        const query = 'SELECT a.userid FROM ezb_wa_api_keys AS a , ezb_wa_msg_settings AS b WHERE a.userid = b.userid AND a.apikey = ? AND  b.phone_number_id = ?';
        const value = [apikeys, wabaid];

        const rows = await wabot_db.query(query, value);

        return rows;
    } catch (err) {
        return err;
    }
};

const getUserStatus = async (userid) => {
    try {
        const query = 'select `userstatus` from `ezb_users` where userid=?';
        const value = [userid];
        const rows = await wabot_db.query(query, value);
        return rows;
    } catch (err) {
        return err;
    }
};

const fetchUserId = async (userid) => {
    try {
        const query = 'select `userid` from `ezb_wa_db_stats` where userid=?;';
        const values = [userid];
        const rows = await wabot_db.query(query, values);
        return rows;
    } catch (err) {
        return err;
    }
};

const getUserSettings = async (userid, wanumber) => {
    try {
        let query;
        if (wanumber != '') {
            query = 'select `usrnm`, `usrpass`, `authts`, `authvalidity`, `authtoken`, `waurl`, `wanumber` from `ezb_wa_msg_settings` where userid = ? AND wanumber LIKE ?';
        } else {
            query = 'select `usrnm`, `usrpass`, `authts`, `authvalidity`, `authtoken`, `waurl`, `wanumber` from `ezb_wa_msg_settings` where userid = ?';
        }

        const value = [userid, '%' + wanumber + '%'];
        const rows = await wabot_db.query(query, value);
        return rows;
    } catch (err) {
        return err;
    }
};


const insertDBStats = async (userid, NonWhatsappUserValue, WhatsappUserValue, MessageReceiptValue, DbMessages, DbPendingCallbacksValue, DbPendingMessagesValue) => {
    try {
        const query = 'INSERT INTO `ezb_wa_db_stats` (`userid`,`db_contacts_nonuser_value`,`db_contacts_user_value`,`db_message_receipts`,`type_object`,`db_pending_callbacks`,`db_pending_messages`) VALUES(?,?,?,?,?,?,?)';
        const value = [userid, NonWhatsappUserValue, WhatsappUserValue, MessageReceiptValue, DbMessages, DbPendingCallbacksValue, DbPendingMessagesValue];
        const rows = await wabot_db.query(query, value);
        return rows;
    } catch (err) {
        return err;
    }
};

const updateDBStats = async (userid, NonWhatsappUserValue, WhatsappUserValue, MessageReceiptValue, DbMessages, DbPendingCallbacksValue, DbPendingMessagesValue) => {
    try {
        const query = 'update `ezb_wa_db_stats` set `db_contacts_nonuser_value`=?,`db_contacts_user_value`=?,`db_message_receipts`=?,`type_object`=?,`db_pending_callbacks`=?,`db_pending_messages`=? where userid=?';
        const value = [NonWhatsappUserValue, WhatsappUserValue, MessageReceiptValue, DbMessages, DbPendingCallbacksValue, DbPendingMessagesValue, userid];
        const rows = await wabot_db.query(query, value);
        return rows;
    } catch (err) {
        return err;
    }
};

const getWaHealthStatus = async (userid, updatewaGetHealthStatus) => {
    try {
        const query = 'update `ezb_users` set `waba_health_status` = ? where userid = ?';
        const value = [updatewaGetHealthStatus, userid];
        const rows = await wabot_db.query(query, value);
        return rows;
    } catch (err) {
        return err;
    }
};

const getWabaId = async (userid, wanumber) => {
    try {
        const query = 'SELECT whatsapp_business_account_id FROM `ezb_wa_msg_settings` WHERE userid =? AND wanumber=?';
        const value = [userid, '+' + wanumber];
        const rows = await wabot_db.query(query, value);
        return rows;
    } catch (err) {
        return err;
    }
};

const getAccessToken = async () => {
    try {
        const query = 'select value from `ezb_system_config` where paramname = ?';
        const value = ['ACCESS_TOKEN'];
        const rows = await wabot_db.query(query, value);
        return rows;
    } catch (err) {
        return err;
    }

};

const insertTemplateDetails = async (result, data) => {

    try {
        let queryInsert = 'INSERT INTO `ezb_wa_templates` (botid,temptitle,category,langcode,userid,head_temptype,head_text_title,head_mediatype,head_media_url,head_media_filename,body_message,placeholders,footer_text,button_option,button_option_string,request_to_admin,status,placeholder_template_type,waba_approval_response_id,is_email_sent,sample_content,auserid,euserid,entrytime,lastupdatetime,marketing_opt_out,marketing_consent) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW(),?,?)';
        let values = [null, data.name, data.category, data.language, data.userid, data.head_temptype, data.head_text_title, data.head_mediatype, data.head_media_url, data.head_media_filename, data.body_message, data.bodyplaceholders, data.footer_text, data.button_option, JSON.stringify(data.button_option_string), data.request_to_admin, data.status, data.placeholder_template_type, result.id, data.is_email_sent, JSON.stringify(data.sample_content), data.userid, data.userid, data.marketing_opt_out, data.marketing_consent];
        let rows = await wabot_db.query(queryInsert, values);
        return rows;
    } catch (err) {
        return err;
    }
};

const getTemplateName = async (id) => {
    try {
        const query = 'SELECT temptitle FROM `ezb_wa_templates` WHERE tempid =?';
        const value = [id];
        const rows = await wabot_db.query(query, value);
        return rows;
    } catch (err) {
        return err;
    }

};

const gettemplatestatus = async (id) => {

    try {
        const query = 'SELECT * FROM `ezb_wa_templates` WHERE tempid =?';
        const value = [id];
        const rows = await wabot_db.query(query, value);
        return rows;
    } catch (err) {
        return err;
    }


};

const getUserId1 = async (apikeys, wanumber) => {
    try {
        const query = 'SELECT a.userid FROM ezb_wa_api_keys AS a, ezb_wa_msg_settings AS b WHERE a.userid = b.userid AND a.apikey = ? AND  b.wanumber = ?';
        const value = [apikeys, '+' + wanumber];
        const rows = await wabot_db.query(query, value);
        return rows;
    } catch (err) {
        return err;
    }
};

let UpdateWhatsappFlowStatustoPublish = async (flowid) => {
    try {
        const query = 'update `ezb_whatsapp_flows_master` set `status`=? where flowid=?';
        const value = [1, flowid];
        const rows = await wabot_db.query(query, value);
        return rows;
    } catch (err) {
        return err;
    }
};

let insertWhatsappFlow = async (userid, wabaid, name, categories, status, flowid) => {
    try {
        let queryInsert = 'INSERT INTO `ezb_whatsapp_flows_master` (userid,wabaid,name,category,status,flowid) VALUES (?,?,?,?,?,?)';
        let values = [userid, wabaid, name, categories, status, flowid];
        let rows = await wabot_db.query(queryInsert, values);
        return rows;
    } catch (err) {
        return err;
    }
};

let GetBusinessPublicKeyStatus = async (business_public_key, phonenumberid) => {
    try {
        const query = 'update `ezb_whatsapp_flows_config_master` set `business_public_key`=? where phone_number_id =?';
        const value = [business_public_key, phonenumberid];
        const rows = await wabot_db.query(query, value);
        return rows;
    } catch (err) {
        return err;
    }
};

let SetBusinessPublicKeyStatus = async (wanumber, phonenumberid, wabaid, userid, business_public_key) => {
    try {
        const query = 'insert into ezb_whatsapp_flows_config_master (wabanumber,phone_number_id,waba_id,userid,business_public_key,createdt) values (?,?,?,?,?,now())';
        const value = [wanumber, phonenumberid, wabaid, userid, business_public_key];
        const rows = await wabot_db.query(query, value);
        return rows;
    } catch (err) {
        return err;
    }
};

let UpdateWhatsappFlowStatustoDelete = async (flowid) => {
    try {

        const query = 'update `ezb_whatsapp_flows_master` set `status`=? where flowid=?';
        const value = [5, flowid];
        const rows = await wabot_db.query(query, value);
        return rows;
    } catch (err) {
        return err;
    }
};

let UpdateWhatsappFlowStatustoDepricate = async (flowid) => {
    try {
        const query = 'update `ezb_whatsapp_flows_master` set `status`=? where flowid=?';
        const value = [2, flowid];
        const rows = await wabot_db.query(query, value);
        return rows;
    } catch (err) {
        return err;
    }
};

let updateWabaApprovalResponseId = async (status, msgtempid) => {
    try {
        query = 'UPDATE `ezb_wa_templates` SET status = ? WHERE waba_approval_response_id = ? ';
        values = [status, msgtempid];
        rows = await wabot_db.query(query, values);
        // return rows[0];
        return rows;
    } catch (err) {
        return err;

    }
};

const phonenumberid1 = async (wanumber) => {
    try {
        const query = 'SELECT phone_number_id FROM ezb_wa_msg_settings Where wanumber=?';;
        const value = ['+' + wanumber];
        const rows = await wabot_db.query(query, value);
        return rows;
    } catch (err) {
        return err;
    }
};

const insertFlowsTemplateDetails = async (result, data) => {

    try {
        let queryInsert = 'INSERT INTO `ezb_wa_templates_flows` (botid,temptitle,category,langcode,userid,head_temptype,head_text_title,head_mediatype,head_media_url,head_media_filename,body_message,placeholders,footer_text,button_option,button_option_string,request_to_admin,status,placeholder_template_type,waba_approval_response_id,is_email_sent,sample_content,auserid,euserid,entrytime,lastupdatetime,marketing_opt_out,marketing_consent) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW(),?,?)';
        let values = [null, data.name, data.category, data.language, data.userid, data.head_temptype, data.head_text_title, data.head_mediatype, data.head_media_url, data.head_media_filename, data.body_message, data.bodyplaceholders, data.footer_text, data.button_option, JSON.stringify(data.button_option_string), data.request_to_admin, data.status, data.placeholder_template_type, result.id, data.is_email_sent, JSON.stringify(data.sample_content), data.userid, data.userid, data.marketing_opt_out, data.marketing_consent];
        let rows = await wabot_db.query(queryInsert, values);
        return rows;
    } catch (err) {
        return err;
    }
};

const fetchtemplateId = async (responseid) => {
    try {
        const query = 'SELECT tempid, waba_approval_response_id,temptitle FROM ezb_wa_templates Where waba_approval_response_id = ?';
        const value = [responseid];
        const rows = await wabot_db.query(query, value);
        return rows;
    } catch (err) {
        return err;
    }
};

const insertTemplateDetailscarousel1 = async (
    result,
    data,
    carousel_payload1,
    body_messageM,
    bodyplaceholdersM,

) => {
    let result_id = result.id;
    try {
        let queryInsert =
            'INSERT INTO ezb_wa_templates set temptitle= ?,category= ?,allow_category_change= ? ,type_of_marketing=?,marketing_template_format=?,langcode=?,userid=?,head_temptype=?,head_mediatype=?,body_message=?,placeholders=?,request_to_admin=?,carousal_payload=?,status=?,placeholder_template_type=?,waba_approval_response_id="?",is_email_sent=?,sample_content=?,auserid=?,euserid=?,entrytime=now(),lastupdatetime=now(),marketing_opt_out=?,marketing_consent=?';
        let values = [
            data.name,
            data.category,
            0,
            0,
            0,
            data.language,
            data.userid,
            data.head_temptype,
            6,
            body_messageM,
            bodyplaceholdersM,
            data.request_to_admin,
            JSON.stringify(carousel_payload1),
            data.status,
            data.placeholder_template_type,
            JSON.parse(result_id),
            data.is_email_sent,
            JSON.stringify(data.sample_content),
            data.userid,
            data.userid,
            0,
            0,
        ];


        let rows = await wabot_db.query(queryInsert, values);

        return rows[0];
    } catch (error) {
        return error.message;
    }
};


// const insertTemplateDetailsV2 = async (result, data, flowid1, carousel_payload, category_change, type_of_marketing, marketing_template_format, head_media_url, status112) => {

//     try {
//         let queryInsert = 'INSERT INTO `ezb_wa_templates` (botid,temptitle,category,langcode,userid,head_temptype,head_text_title,head_mediatype,head_media_url,head_media_filename,body_message,placeholders,footer_text,button_option,button_option_string,request_to_admin,status,placeholder_template_type,waba_approval_response_id,is_email_sent,sample_content,auserid,euserid,entrytime,lastupdatetime,marketing_opt_out,marketing_consent,carousal_payload,allow_category_change,type_of_marketing,marketing_template_format) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW(),?,?,?,?,?,?)';
//         let values = [null, data.name, data.category, data.language, data.userid, data.head_temptype, data.head_text_title, data.head_mediatype, head_media_url, data.head_media_filename, data.body_message, data.bodyplaceholders, data.footer_text, data.button_option, JSON.stringify(data.button_option_string), data.request_to_admin, status112, data.placeholder_template_type, result.id, data.is_email_sent, JSON.stringify(data.sample_content), data.userid, data.userid, data.marketing_opt_out, data.marketing_consent, JSON.stringify(carousel_payload), category_change, type_of_marketing, marketing_template_format];
//         let rows = await wabot_db.query(queryInsert, values);
//         return rows[0];
//     } catch (error) {
//         return error;
//     }
// };

const insertTemplateDetailsV2 = async (result, data, flowid1, carousel_payload, category_change, type_of_marketing, marketing_template_format, head_media_url, status112, lto_expiration_time_flag, ltotext, authentication_payload) => {

    try {
        let queryInsert = 'INSERT INTO `ezb_wa_templates` (botid,temptitle,category,langcode,userid,head_temptype,head_text_title,head_mediatype,head_media_url,head_media_filename,body_message,placeholders,footer_text,button_option,button_option_string,request_to_admin,status,placeholder_template_type,waba_approval_response_id,is_email_sent,sample_content,auserid,euserid,entrytime,lastupdatetime,marketing_opt_out,marketing_consent,carousal_payload,allow_category_change,type_of_marketing,marketing_template_format,lto_expiration_time_flag,lto_offer_text,template_authentication_payload) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW(),?,?,?,?,?,?,?,?,?)';
        let values = [null, data.name, data.category, data.language, data.userid, data.head_temptype, data.head_text_title, data.head_mediatype, head_media_url, data.head_media_filename, data.body_message, data.bodyplaceholders, data.footer_text, data.button_option, JSON.stringify(data.button_option_string), data.request_to_admin, status112, data.placeholder_template_type, result.id, data.is_email_sent, JSON.stringify(data.sample_content), data.userid, data.userid, data.marketing_opt_out, data.marketing_consent, JSON.stringify(carousel_payload), category_change, type_of_marketing, marketing_template_format, lto_expiration_time_flag, ltotext, JSON.stringify(authentication_payload)];
        let rows = await wabot_db.query(queryInsert, values);
        return rows[0];
    } catch (error) {
        return error;
    }
};
const insertTemplateDetailsV3update = async (result, data, flowid1, carousel_payload, category_change, type_of_marketing, marketing_template_format, head_media_url, status112) => {

    try {
        let queryInsert = 'update `ezb_wa_templates` (botid,temptitle,category,langcode,userid,head_temptype,head_text_title,head_mediatype,head_media_url,head_media_filename,body_message,placeholders,footer_text,button_option,button_option_string,request_to_admin,status,placeholder_template_type,is_email_sent,sample_content,auserid,euserid,entrytime,lastupdatetime,marketing_opt_out,marketing_consent,flowid,carousal_payload,allow_category_change,type_of_marketing,marketing_template_format where waba_approval_response_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW(),?,?,?,?,?,?,?,?)';
        let values = [null, data.name, data.category, data.language, data.userid, data.head_temptype, data.head_text_title, data.head_mediatype, head_media_url, data.head_media_filename, data.body_message, data.bodyplaceholders, data.footer_text, data.button_option, JSON.stringify(data.button_option_string), data.request_to_admin, status112, data.placeholder_template_type, data.is_email_sent, JSON.stringify(data.sample_content), data.userid, data.userid, data.marketing_opt_out, data.marketing_consent, flowid1, JSON.stringify(carousel_payload), category_change, type_of_marketing, marketing_template_format, result.id];
        let rows = await wabot_db.query(queryInsert, values);
        return rows[0];
    } catch (error) {
        return error;
    }
};
const get_URL_headerhandel = async (temp_h) => {
    try {
        let queryInsert = 'select url,mime_type from `ezb_handlerv3` where header_handle = ?';
        let values = temp_h;
        let rows = await wabot_db.query(queryInsert, values);
        return rows[0];
    } catch (error) {
        return error.message;
    }
};
const get_userid_by_waba_approval_response_id = async (id) => {

    try {
        let queryInsert = 'select auserid from ezb_wa_templates where waba_approval_response_id = ?;';
        let values = [id];
        let rows = await wabot_db.query(queryInsert, values);
        return rows;
    } catch (error) {
        return error.message;
    }
};


let updateTemplateDetails = async (waba_approval_response_id, resubmit_counter, data, carousel_payload, flowid1, status112, type_of_marketing, marketing_template_format) => {
    try {
        resubmit_counter = resubmit_counter + 1;

        let queryupdate = "update ezb_wa_templates set botid=?,userid=?,head_temptype=?,head_text_title=?,head_mediatype=?,head_media_url=?,head_media_filename=?,body_message=?,placeholders=?,footer_text=?,button_option=?,button_option_string=?,request_to_admin=?,status=?,placeholder_template_type=?,is_email_sent=?,sample_content=?,auserid=?,euserid=?,entrytime=NOW(),lastupdatetime=NOW(),marketing_opt_out=?,marketing_consent=?, carousal_payload=?,resubmit_counter = ?,type_of_marketing=?,marketing_template_format=? where waba_approval_response_id=?";

        let values = [null, data.userid, data.head_temptype, data.head_text_title, data.head_mediatype, data.head_media_url, data.head_media_filename, data.body_message, data.bodyplaceholders, data.footer_text, data.button_option, JSON.stringify(data.button_option_string), data.request_to_admin, status112, data.placeholder_template_type, data.is_email_sent, JSON.stringify(data.sample_content), data.userid, data.userid, data.marketing_opt_out, data.marketing_consent, JSON.stringify(carousel_payload), resubmit_counter, type_of_marketing, marketing_template_format, waba_approval_response_id];

        let rows = await wabot_db.query(queryupdate, values);
        return rows[0];
    } catch (error) {
        return error;
    }
};
const insertheaderdatav3 = async (userid, head_media_url, temp_h, FileType) => {
    try {
        let queryInsert = 'INSERT INTO `ezb_handlerv3` (userid,header_handle,url,create_date,mime_type) VALUES (?,?,?,NOW(),?)';
        let values = [userid, temp_h, head_media_url, FileType];
        let rows = await wabot_db.query(queryInsert, values);
        return rows[0];
    } catch (err) {
        return err;
    }
};



const getPhoneid = async (userid) => {
    const query = 'select whatsapp_business_account_id,wanumber,phone_number_id from ezb_wa_msg_settings where userid =?';
    const value = userid[0][0].userid;
    const [result] = await wabot_db.query(query, value);
    return result;
};

const updateWhatsappMetadata = async (name, category, id) => {
    try {
        let queryupdate = "update ezb_whatsapp_flows_master set name=?,category=? where flowid=?";
        const value = [name, category, id];
        let rows = await wabot_db.query(queryupdate, value);
        return rows[0];
    } catch (error) {
        return error;
    }
};

const getFlowData = async (id) => {
    try {
        let queryupdate = "Select * from ezb_whatsapp_flows_master where flowid=?";
        const value = [id];
        let rows = await wabot_db.query(queryupdate, value);
        return rows[0];
    } catch (error) {
        return error;
    }
};

const getMsgSettingDetails = async (phoneid) => {
    try {
        let query = "SELECT wanumber,whatsapp_business_account_id,userid FROM `ezb_wa_msg_settings` WHERE phone_number_id=?";
        const values = [phoneid];
        let rows = await wabot_db.query(query, values);
        return rows[0];
    } catch (error) {
        return error;
    }
};

updateBusinessPublicKeyStatus = async (id, business_public_key) => {
    try {
        let queryupdate = "update ezb_whatsapp_flows_config_master set business_public_key=?,where phone_number_id=?";
        const value = [name, category, id];
        let rows = await wabot_db.query(queryupdate, value);
        return rows[0];
    } catch (error) {
        return error;
    }
};



const getFlowInfo = async (id) => {
    try {
        let queryupdate = "Select * from ezb_whatsapp_flows_master where flowid=?";
        const value = [id];
        let rows = await wabot_db.query(queryupdate, value);
        return rows[0];
    } catch (error) {
        return error;
    }
};




module.exports = {
    getApiKey,
    getUserId,
    getUserStatus,
    fetchUserId,
    getUserSettings,
    insertDBStats,
    updateDBStats,
    getWaHealthStatus,
    getWabaId,
    getAccessToken,
    insertTemplateDetails,
    getTemplateName,
    gettemplatestatus,
    getUserId1,
    insertWhatsappFlow,
    GetBusinessPublicKeyStatus,
    SetBusinessPublicKeyStatus,
    UpdateWhatsappFlowStatustoDelete,
    UpdateWhatsappFlowStatustoDepricate,
    updateWabaApprovalResponseId,
    phonenumberid1,
    insertFlowsTemplateDetails,
    fetchtemplateId,
    insertTemplateDetailscarousel1,
    insertTemplateDetailsV2,
    get_URL_headerhandel,
    get_userid_by_waba_approval_response_id,
    updateTemplateDetails,
    insertTemplateDetailsV3update,
    getUserIdbyPhno,
    insertheaderdatav3,
    getUserIdbyapikey,
    getPhoneid,
    updateWhatsappMetadata,
    getFlowData,
    UpdateWhatsappFlowStatustoPublish,
    getMsgSettingDetails,
    updateBusinessPublicKeyStatus,
    getFlowInfo
};