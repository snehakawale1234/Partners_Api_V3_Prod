
const user = require('../../services/v3/user');
const { performance } = require('perf_hooks');
const whatsappService = require('../../services/v3/whatsapp');
const userService1 = require('../../services/v3/userStat');
const sendService = require('../../services/v3/send');
const { json } = require('express');
let sentMasterSchema = require('../../model/sentMasterModel');
var appLoggers = require('../../apploggerV3.js');
let { v4: uuidv4 } = require('uuid');
const { tryEach } = require('async');
var errorLogger = appLoggers.errorLogger;
var infoLogger = appLoggers.infoLogger;



module.exports = async (req, res) => {

    try {
        //console.log('REQ IP : ' + req.ip);
        let message_id = req.body.message_id;
        let apikey = req.headers.apikey;
        let id = req.params.id;
        let body = req.body;
        let userid = null;
        let wa_msg_setting_id;
        let whatsapp_business_account_id = null;
        let direction = 1;
        let clientPayload = null;
        let bodycontent = null;
        let category = null;
        let categoryId = 0;
        let templateid = null;
        let temptype = req.body.type;
        let msgSettingIdRes = null;
        let msgtype = null;
        let campaignid;
        let access_token;
        let sendflag;
        let wanumber;
        let result;
        let recipientnumber;
        let product;
        let url;
        let recipienttype;
        let text;
        let temptitle;
        let finalPayload;
        let msgType;
        let ststus112;
        const startTime = performance.now();
        let sentMasterUUID = uuidv4();
        let uuid = uuidv4();
        let bizOpaqueCallbackData = {};
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

                access_token = getSystemAccessTokenResult.VALUE;

                let getusersv3 = await userService1.getUserIdbyPhno(apikey, id);

                if (getusersv3[0][0] == undefined) {
                    return res.status(401).send({
                        code: 100,
                        status: "failed",
                        message: "Authentication Failed"
                    });
                } else {

                    if (!message_id) {
                        userid = getusersv3[0][0].userid;
                        let objData = {
                            access_token,
                            body
                        };
                        sendflag = null;
                        const wanumberResult = await sendService.getwanumber(id);

                        wanumber = wanumberResult[0].wanumber.replace('+', '');
                        msgSettingIdRes = wanumberResult[0].wa_msg_setting_id;

                        const UserInfoResult = await sendService.UserInfo(userid);
                        //validating user balance
                        if (UserInfoResult != null) {

                            result = UserInfoResult;
                            if (result[0].userstatus == 1) {

                                if (result[0].account_type == 0) {

                                    if (result[0].postpaid_credit_limit_flag == 1 && result[0].postpaid_credit_amt > 0) {
                                        userid = result[0].userid;

                                        sendflag = 1;

                                    } else if (result[0].postpaid_credit_limit_flag == 0) {
                                        userid = result[0].userid;

                                        sendflag = 1;

                                    } else if (result[0].postpaid_credit_limit_flag == null) {

                                        userid = result[0].userid;
                                        sendflag = 1;

                                    } else {

                                        sendflag = 0;

                                        res.send({
                                            code: 100,
                                            status: 'FAILED',
                                            message: 'Insufficient Balance',
                                        });

                                    }
                                } else if (result[0].account_type == 1) {

                                    if (result[0].balance_amt > 0) {

                                        userid = result[0].userid;

                                        sendflag = 1;

                                    } else {

                                        sendflag = 0;

                                        res.send({
                                            code: 100,
                                            status: 'FAILED',
                                            message: 'Insufficient Balance',
                                        });

                                    }
                                }
                            } else {

                                res.send({
                                    code: 100,
                                    status: 'FAILED',
                                    message: 'User is Inactive',
                                });

                            }
                        } else {
                            res.send({
                                code: 100,
                                status: 'FAILED',
                                message: 'User is Inactive',
                            });
                        }

                        if (sendflag === 1) {

                            product = req.body.messaging_product;
                            recipientnumber = req.body.to;
                            url = req.body.preview_url;
                            recipienttype = req.body.recipient_type;
                            msgtype = req.body.type;
                            text = req.body.text;
                            if (msgtype == 'template') {
                                temptitle = req.body.template.name;
                                //finding template against user
                                let templatetitleuserid = await sendService.templatetitleuserid(temptitle, userid);

                                if (!templatetitleuserid[0][0]) {
                                    // return ({
                                    //     code: 100,
                                    //     status: "failed",
                                    //     message: "Template not found"
                                    // });
                                    bodycontent = {
                                        "body": 'Not Available'
                                    };
                                }


                                category = templatetitleuserid[0][0] != undefined ? templatetitleuserid[0][0].category : '';
                                templateid = templatetitleuserid[0][0] != undefined ? templatetitleuserid[0][0].tempid : '';
                                //bizOpaqueCallbackData handling
                                let sentMasterUUID = 'pin_' + uuidv4();
                                finalPayload = req.body;
                                if (req.body.biz_opaque_callback_data != undefined) {
                                    req.body.biz_opaque_callback_data.userid = userid;
                                    req.body.biz_opaque_callback_data.campaignid = 0;
                                    req.body.biz_opaque_callback_data.source = "api/partners";
                                    req.body.biz_opaque_callback_data.mobileno = recipientnumber;
                                    req.body.biz_opaque_callback_data.templateid = templateid;
                                    req.body.biz_opaque_callback_data.direction = 1;
                                    req.body.biz_opaque_callback_data.template_category = category.toLowerCase();
                                    req.body.biz_opaque_callback_data.sent_master_uuid = sentMasterUUID;
                                } else {
                                    bizOpaqueCallbackData = {
                                        "userid": userid,
                                        "campaignid": 0,
                                        "source": "api/partners",
                                        "mobileno": recipientnumber,
                                        "templateid": templateid,
                                        "direction": 1,
                                        "template_category": category.toLowerCase(),
                                        "sent_master_uuid": sentMasterUUID
                                    };
                                    objData.body["biz_opaque_callback_data"] = bizOpaqueCallbackData;
                                }



                            }
                            //meta api for sending template
                            let send_templateresult = await whatsappService.send_template(objData, id);
                            switch (msgtype) {
                                case "text":
                                    bodycontent = req.body.text;
                                    msgType = 4;
                                    break;
                                case "document":
                                    bodycontent = {
                                        "body": "<a href='" + req.body.document.link + "'>Media</a>"
                                    };
                                    msgType = 0;
                                    break;
                                case "image":
                                    bodycontent = {
                                        "body": "<a href='" + req.body.image.link + "'>Media</a>"
                                    };
                                    msgType = 1;
                                    break;
                                case "video":
                                    bodycontent = {
                                        "body": "<a href='" + req.body.video.link + "'>Media</a>"
                                    };
                                    msgType = 2;
                                    break;
                                case "audio":
                                    bodycontent = {
                                        "body": "<a href='" + req.body.audio.link + "'>Media</a>"
                                    };
                                    msgType = 3;
                                    break;
                                case "reaction":
                                    bodycontent = {
                                        "body": req.body.reaction.emoji
                                    };
                                    msgType = 3;
                                    break;
                                case "location":
                                    bodycontent = {
                                        "body": {
                                            "latitude": req.body.location.latitude, "longitude": req.body.location.longitude,
                                        }
                                    };
                                    msgType = 5;
                                    break;
                                case "contacts":
                                    bodycontent = {
                                        "body": [{
                                            "addresses": [],
                                            "emails": [],
                                            "ims": [],
                                            "name": {
                                                "first_name": req.body.contacts[0].name.first_name,
                                                "formatted_name": req.body.contacts[0].name.formatted_name,
                                                "last_name": req.body.contacts[0].name.last_name,
                                            },
                                            "org": {},
                                            "phones": [],
                                            "urls": []
                                        }]
                                    };
                                    msgType = 6;
                                    break;
                                case 'sticker':
                                    bodycontent = {
                                        "body": "<a href='" + req.body.sticker.url + "'>Media</a>"
                                    };
                                    msgType = 7;
                                    break;
                                case 'interactive':
                                    if (req.body.interactive != undefined) {
                                        bodycontent = {
                                            "body": req.body.interactive.body.text != undefined ? req.body.interactive.body.text : ""
                                        };
                                        msgType = 9;
                                    }

                                    break;
                                case 'template':

                                    temptitle = req.body.template.name;


                                    msgType = 8;
                                    let templatetitleuserid = await sendService.templatetitleuserid(temptitle, userid);
                                    // console.log("=========>templatetitleuserid", templatetitleuserid);
                                    if (!templatetitleuserid[0][0]) {
                                        // return ({
                                        //     code: 100,
                                        //     status: "failed",
                                        //     message: "Template not found"
                                        // });
                                        bodycontent = {
                                            "body": 'Not Available'
                                        };
                                    }


                                    category = templatetitleuserid[0][0] != undefined ? templatetitleuserid[0][0].category : '';
                                    category = category.toLowerCase();
                                    templateid = templatetitleuserid[0][0] != undefined ? templatetitleuserid[0][0].tempid : '';


                                    categoryId = 1;
                                    if (templatetitleuserid) {
                                        category = templatetitleuserid[0][0] != undefined ? templatetitleuserid[0][0].category : '';
                                        category = category.toLowerCase();
                                        templateid = templatetitleuserid[0][0] != undefined ? templatetitleuserid[0][0].tempid : '';

                                        categoryId = 1;
                                        if (templatetitleuserid.length > 0) {

                                            if (templatetitleuserid[0][0] != undefined && templatetitleuserid[0][0].body_message == undefined) {
                                                bodycontent = {
                                                    "body": 'Not Available'
                                                };
                                            } else {
                                                bodycontent = {
                                                    "body": templatetitleuserid[0][0] != undefined ? templatetitleuserid[0][0].body_message.toString() : 'Not Available'
                                                };
                                            }



                                        } else {

                                            let templatetitlewabaidResult = await sendService.templatetitlewabaid(temptitle, whatsapp_business_account_id);

                                            if (templatetitlewabaidResult.length > 0) {
                                                if (templatetitleuserid[0][0] != undefined && templatetitleuserid[0][0].body_message == undefined) {

                                                    bodycontent = {
                                                        "body": 'Not Available'
                                                    };
                                                }
                                                else {
                                                    bodycontent = {
                                                        "body": templatetitleuserid[0][0] != undefined ? templatetitleuserid[0][0].body_message.toString() : 'Not Available'
                                                    };
                                                }


                                                category = templatetitlewabaidResult[0].category;
                                                category = category.toLowerCase();
                                                categoryId = 1;

                                            }

                                        }
                                    }
                                    break;
                            }
                            if (send_templateresult.status === 200) {
                                let messageid = send_templateresult.data.messages[0].id;
                                let errorCode = send_templateresult.data.code;
                                let fbtrace_id = send_templateresult.data.fbtrace_id;
                                let errorDesc = send_templateresult.data.message;

                                let body = req.body;
                                let wa_msg_setting_id = msgSettingIdRes;
                                let objMsg = req.body;
                                campaignid = 0;

                                const documentToInsert = {
                                    userid: userid,
                                    mobileno: recipientnumber,
                                    wabapayload: bodycontent,
                                    client_payload: objMsg,
                                    body_content: bodycontent,
                                    messageid: messageid,
                                    errcode: errorCode,
                                    errdesc: errorDesc,
                                    createdt: Date.now(),
                                    status: 0,
                                    readstatus: 0,
                                    messagetype: msgType,
                                    source: 1,
                                    campaignid: 0,
                                    contactno: '+' + wanumber,
                                    msg_setting_id: wa_msg_setting_id,
                                    direction: 1,
                                    fbtrace_id: fbtrace_id,
                                    category: category,
                                    category_id: categoryId,
                                    uuid: uuid,
                                    sent_master_uuid: "Pin_" + sentMasterUUID,
                                    templateid: templateid
                                };
                                let dynamicModelResult = await sendService.dynamicModelCreator(wanumber, sentMasterSchema);

                                if (dynamicModelResult) {
                                    try {
                                        await dynamicModelResult.insertMany(documentToInsert);
                                    } catch (error) {
                                        return res.status(400).send({
                                            code: 100,
                                            status: "failed",
                                            message: "something went wrong"
                                        });
                                    }
                                    console.log("documents inserted ");
                                } else {

                                    return res.status(200).send(
                                        {
                                            code: 100,
                                            status: "failed",
                                            message: "Dynamic model Creation Failed"
                                        }
                                    );
                                }


                                if (send_templateresult.data !== undefined) {
                                    return res.status(200).send(
                                        send_templateresult.data
                                    );
                                } else {
                                    return res.status(400).send(
                                        {
                                            code: 100,
                                            status: "failed",
                                            message: "ETIMEDOUT"
                                        }

                                    );
                                }


                            } else {


                                messageid = null;
                                errorCode = send_templateresult.response !== undefined ? send_templateresult.response.data.error.code : 101;
                                fbtrace_id = send_templateresult.response !== undefined ? send_templateresult.response.data.error.fbtrace_id : send_templateresult;
                                errorDesc = send_templateresult.response !== undefined ? send_templateresult.response.data.error.message : send_templateresult;

                                let body = req.body;
                                wa_msg_setting_id = msgSettingIdRes;
                                objMsg = req.body;
                                campaignid = 0;
                                const documentToInsert = {
                                    userid: userid,
                                    mobileno: recipientnumber,
                                    wabapayload: objMsg,
                                    client_payload: clientPayload,
                                    body_content: bodycontent,
                                    messageid: messageid,
                                    errcode: errorCode,
                                    errdesc: errorDesc,
                                    createdt: Date.now(),
                                    status: 0,
                                    readstatus: 3,
                                    messagetype: msgType,
                                    source: 1,
                                    campaignid: 0,
                                    contactno: '+' + wanumber,
                                    msg_setting_id: wa_msg_setting_id,
                                    direction: 1,
                                    fbtrace_id: fbtrace_id,
                                    category: category,
                                    category_id: categoryId,
                                    uuid: uuid,
                                    sent_master_uuid: "Pin_" + sentMasterUUID,
                                    templateid: templateid

                                };
                                let dynamicModelResult = await sendService.dynamicModelCreator(wanumber, sentMasterSchema);

                                if (dynamicModelResult) {
                                    //data inserted into mongodb dynamic model
                                    try {
                                        await dynamicModelResult.insertMany(documentToInsert);
                                    } catch (error) {
                                        return res.status(400).send({
                                            code: 100,
                                            status: "failed",
                                            message: "something went wrong"
                                        });
                                    }
                                    console.log("documents inserted ");
                                    // await dynamicModelResult.insertMany(documentToInsert);

                                } else {
                                    // Handle the case where dynamicModelCreatorResult is falsy
                                    return res.status(400).send(
                                        {
                                            code: 100,
                                            status: "failed",
                                            message: "Dynamic model Creation Failed"
                                        }

                                    );
                                }
                                if (send_templateresult.response !== undefined) {
                                    ststus112 = send_templateresult.response.status;
                                    return res.status(ststus112).send(
                                        send_templateresult.response.data
                                    );

                                } else {
                                    return res.status(400).send(
                                        {
                                            code: 100,
                                            status: "failed",
                                            message: "ETIMEDOUT"
                                        }

                                    );
                                }

                            }
                        }
                    } else {

                        let objData = {
                            access_token,
                            body
                        };
                        let send_templateresult = await whatsappService.send_template(objData, id);

                        if (send_templateresult.status === 200) {
                            return res.status(200).send(
                                send_templateresult.data
                            );
                        } else {

                            ststus112 = send_templateresult.response.status;
                            return res.status(ststus112).send(
                                send_templateresult.response.data
                            );

                        }
                    }
                }
            }
        }
    } catch (error) {
        return res.status(500).send({
            code: 'WA100',
            status: 'FAILED',
            message: error.message || 'Invalid Request',
            data: {}
        });
    }

};




