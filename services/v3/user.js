require('dotenv').config();
const dbpool = require('../../db/database');
const fs = require('fs');
const async = require('async');
const AWS = require('aws-sdk');
const path = require('path');
const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
});



const BUCKET_NAME = "whatsappdata";
const params = {
    Bucket: BUCKET_NAME,
    CreateBucketConfiguration: {
        LocationConstraint: "ap-south-1"
    }
};


selectapikey = async (apikey) => {
    try {
        let query = "Select count(1) as c from ezb_wa_api_keys where apikey = ?";
        let values = [apikey];
        let rows = await dbpool.query(query, values);
        return rows;
    }
    catch (err) {
        return err;
    }
};

selectwanumber = async (wanumber) => {
    try {
        let query = "Select count(1) as c from ezb_wa_msg_settings where wanumber = ?";
        let values = ['+' + wanumber];
        let rows = await dbpool.query(query, values);
        return rows;
    }
    catch (err) {
        return err;
    }
};


fetchmediausersdetails = async (apikey, wanumber) => {
    try {
        let query = "Select a.userid,b.phone_number_id ,b.wanumber from ezb_wa_api_keys as a , ezb_wa_msg_settings as b" +
            " where a.userid = b.userid and a.apikey = ? and  b.wanumber = ?;";
        let values = [apikey, '+' + wanumber];
        let rows = await dbpool.query(query, values);
        return rows;
    }
    catch (err) {
        return err;
    }
};

getSystemAccessToken = async () => {
    try {
        let query = "SELECT VALUE FROM ezb_system_config WHERE paramname =? ";
        let values = ['ACCESS_TOKEN'];
        let rows = await dbpool.query(query, values);


        return rows[0][0];
    } catch (err) {
        return err;
    }
};

getTemplateAccessToken = async () => {
    try {
        let query = "SELECT VALUE FROM ezb_system_config WHERE paramname =? ";
        let values = ['TEMPLATE_ACCESS_TOKEN'];
        let rows = await dbpool.query(query, values);
        return rows[0][0];
    } catch (err) {
        return err;
    }
};


getusersdetails = async (userid, wanumber) => {
    try {
        let query = "Select usrnm,usrpass,authts,authvalidity,authtoken,waurl,wanumber from ezb_wa_msg_settings where userid = ? and wanumber = ?;";
        let values = [userid, '+' + wanumber];
        let rows = await dbpool.query(query, values);
        return rows;
    } catch (err) {

        return err;
    }
};

insertMedia = async (mediaid, mediatype, mediaurl, medianame, userid) => {
    try {
        const fileContent = fs.readFileSync(mediaurl);

        const params = {
            Bucket: BUCKET_NAME,
            Key: path.basename(mediaurl),
            Body: fileContent
        };

        s3.upload(params, function (err, data) {
            if (err) {

                return done(err);
            }
            else {

                fs.unlink(mediaurl, function (err) {
                    if (err) {
                        console.error(err);
                    }

                });
            }

            let s3Url = data.Location;
            let queryInsert = 'INSERT INTO ezb_wa_media (mediaid,mediatype,mediaurl,medianame,userid) VALUES (?,?,?,?,?)';
            let values = [mediaid, mediatype, s3Url, medianame, userid];
            let rows = dbpool.query(queryInsert, values);
            return rows;
        });

    } catch (err) {
        return err;
    }

};
DeleteTemplateDetails = async (name, userid) => {
    try {
        let queryupdate = "DELETE FROM ezb_wa_templates WHERE temptitle = ? and userid= ?";
        let values = [name, userid];

        let rows = await dbpool.query(queryupdate, values);

        return rows[0];
    } catch (error) {
        return error;
    }
};
getWanumber = async (phoneid) => {

    try {
        console.log("==========>phoneid", phoneid);
        const query = 'SELECT `wanumber` FROM `ezb_wa_msg_settings` WHERE phone_number_id = ?';
        const value = phoneid;
        const [result] = await dbpool.query(query, value);
        return result[0];
    } catch (error) {
        return error;
    }

};

deleteMedia = async (mediaid) => {

    try {

        const query = 'DELETE FROM ezb_wa_media WHERE mediaid= ?';
        const value = [mediaid];

        const [result] = await dbpool.query(query, value);

        return result[0];
    } catch (err) {
        return err;

    };
};
phoneid_count = async (phoneid) => {
    try {
        const query = 'Select count(1) as c from ezb_whatsapp_flows_config_master where phone_number_id = ?';
        const value = [phoneid];
        const [result] = await dbpool.query(query, value);
        return result[0];
    } catch (error) {
        return error;
    }
};

fetchPhoneNumberId = async (apikey) => {
    try {
        let query = "SELECT phone_number_id " +
            "FROM ezb_wa_msg_settings " +
            "WHERE userid IN (SELECT userid FROM ezb_wa_api_keys WHERE apikey = ?) LIMIT 1";
        let values = [apikey];
        let [rows] = await dbpool.query(query, values);
        if (rows.length > 0) {
            return rows[0].phone_number_id; // Access the correct property
        } else {
            return null; // No result found
        }
    } catch (err) {
        console.error("Error: ", err);  // Log the error for debugging
        return err;
    }
};


getAccessTokenByWabaId = async (id) => {
    try {
        let query = "SELECT access_token FROM ezb_embedded_client_access_token WHERE waba_id = ?";
        let values = [id];
        let rows = await dbpool.query(query, values);
        return rows[0][0];
    } catch (err) {
        return err;
    }
};

getAccessTokenByPhoneNumberID = async (id) => {
    try {
        let query = "SELECT access_token FROM ezb_embedded_client_access_token WHERE phone_number_id = ?";
        let values = [id];
        let rows = await dbpool.query(query, values);
        return rows[0][0];
    } catch (err) {
        return err;
    }
};

fetchWabaId = async (apikey) => {
    try {
        let query = "SELECT whatsapp_business_account_id " +
            "FROM ezb_wa_msg_settings " +
            "WHERE userid IN (SELECT userid FROM ezb_wa_api_keys WHERE apikey = ?) LIMIT 1";
        let values = [apikey];
        let [rows] = await dbpool.query(query, values);
        if (rows.length > 0) {
            return rows[0].whatsapp_business_account_id; // Access the correct property
        } else {
            return null; // No result found
        }
    } catch (err) {
        console.error("Error: ", err);  // Log the error for debugging
        return err;
    }
};

selectapikeyByPhoneId = async (apikey) => {
    try {
        let query = "SELECT phone_number_id " +
            "FROM ezb_wa_msg_settings" + " WHERE userid IN (SELECT userid FROM ezb_wa_api_keys WHERE apikey = ?) limit 1";

        let values = [apikey];
        let rows = await dbpool.query(query, values);
        return rows;

    }
    catch (err) {
        return err;
    }
};


selectapikeyByWabaId = async (apikey) => {
    try {
        let query = "SELECT whatsapp_business_account_id " +
            "FROM ezb_wa_msg_settings" + " WHERE userid IN (SELECT userid FROM ezb_wa_api_keys WHERE apikey = ?) limit 1";

        let values = [apikey];
        let rows = await dbpool.query(query, values);
        return rows;

    }
    catch (err) {
        return err;
    }
};
selectwabaId = async (wabaId) => {
    try {
        let query = "Select count(1) as c from ezb_embedded_client_access_token where waba_id = ?";
        let values = [wabaId];
        let rows = await dbpool.query(query, values);
        return rows;
    }
    catch (err) {
        return err;
    }
};


selectPhoneNumberId = async (phoneNumberId) => {
    try {
        let query = "Select count(1) as c from ezb_embedded_client_access_token where phone_number_id = ?";
        let values = [phoneNumberId];
        let rows = await dbpool.query(query, values);
        return rows;
    }
    catch (err) {
        return err;
    }
};



const checkwabaBusinessPublicKey = async (phoneid) => {
    try {
        let queryInsert = 'select count(1) as c from `ezb_whatsapp_flows_config_master` where phone_number_id = ?';
        let values = [phoneid];
        console.log(queryInsert, values);
        let rows = await dbpool.query(queryInsert, values);
        return rows;
    } catch (err) {
        return err;
    }
};


let SetBusinessPublicKeyStatus = async (wabaid, userid, publicKey, privateKey, phoneid, wanumber) => {
    try {
        let publicKeycon;
        let privateKeycon;
        if (publicKey.endsWith('\n')) {
            publicKeycon = publicKey.slice(0, -1);
        }
        if (privateKey.endsWith('\n')) {
            privateKeycon = privateKey.slice(0, -1);
        }

        const query = 'insert into ezb_whatsapp_flows_config_master (waba_id ,userid ,business_public_key,business_private_key,phone_number_id,wabanumber,createdt) VALUES (?,?,?,?,?,?,NOW())';
        const value = [wabaid, userid, publicKeycon, privateKeycon, phoneid, wanumber];
        const rows = await dbpool.query(query, value);
        return rows;
    } catch (err) {
        return err;
    }
};

let GetpublicKeyfromdb = async (phoneid) => {
    try {
        const query = 'select business_public_key from ezb_whatsapp_flows_config_master where phone_number_id =?';
        const value = [phoneid];
        const rows = await dbpool.query(query, value);
        return rows;
    } catch (err) {
        return err;
    }
};

let getPrivateKeyfromdb = async (phoneid) => {
    try {
        const query = 'select business_private_key from ezb_whatsapp_flows_config_master where phone_number_id =?';
        const value = [phoneid];
        const rows = await dbpool.query(query, value);
        return rows;
    } catch (error) {
        return error;
    }
};


let get_tsp_accesstoken = async () => {
    try {
        let query = "SELECT VALUE FROM ezb_system_config WHERE paramname =? ";
        let values = ['TSP_CREDIT_ASSIGNMENT_ACCESS_TOKEN'];
        let rows = await dbpool.query(query, values);
        return rows;
    } catch (err) {
        return err;
    }
};

let catalogIdget = async (userid, wanumber) => {
    try {
        wanumber = "+" + wanumber
        const query = 'select catlogid from ezb_wa_msg_settings where userid = ? AND wanumber = ?;';
        const value = [userid, wanumber];
        const rows = await dbpool.query(query, value);
        return rows[0];
    } catch (err) {
        console.log(err);
    }
};

let getapikeyuserid = async (apikey) => {
    try {
        let query = "Select userid from ezb_wa_api_keys where apikey = ?";
        let values = [apikey];
        let rows = await dbpool.query(query, values);
        return rows;
    }
    catch (err) {
        return err;
    }
};



module.exports = {
    selectapikey,
    selectwanumber,
    fetchmediausersdetails,
    getSystemAccessToken,
    getusersdetails,
    insertMedia,
    DeleteTemplateDetails,
    getWanumber,
    getTemplateAccessToken,
    deleteMedia,
    phoneid_count,
    fetchPhoneNumberId,
    fetchWabaId,
    getAccessTokenByPhoneNumberID,
    getAccessTokenByWabaId,
    selectapikeyByPhoneId,
    selectapikeyByWabaId,
    selectwabaId,
    selectPhoneNumberId,
    checkwabaBusinessPublicKey,
    SetBusinessPublicKeyStatus,
    GetpublicKeyfromdb,
    getPrivateKeyfromdb,
    get_tsp_accesstoken,
    catalogIdget,
    getapikeyuserid
}

