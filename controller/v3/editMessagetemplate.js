require('dotenv').config();
const user = require('../../services/v3/user');
const whatsappService = require('../../services/v3/whatsapp');
const userService1 = require('../../services/v3/userStat');
var appLoggers = require('../../apploggerV3.js');
var errorLogger = appLoggers.errorLogger;
var infoLogger = appLoggers.infoLogger;

module.exports = async (req, res) => {
    try {

        let apikey = req.headers.apikey;
        let insideurlindex1;
        let insideurlindex2;
        let id = req.params.id;
        let datares = null;
        let objData = null;
        let name = req.body.name;
        let language = req.body.language;
        let category = req.body.category;
        let components = req.body.components;
        // eslint-disable-next-line no-undef
        let image_url = process.env.hasImage;
        // eslint-disable-next-line no-undef
        let video_url = process.env.hasVideo;
        // eslint-disable-next-line no-undef
        let document_url = process.env.hasDocument;
        let head_mediatypec;
        let ComponentsData = req.body.components;
        let head_temptype = null;
        let head_text_title = null;
        let head_mediatype = null;
        let head_media_url;
        let head_media_filename = null;
        let body_message;
        let bodyplaceholders = null;
        let urlplaceholder = null;
        let footer_text = null;
        let button_option = null;
        let headerplaceholder = null;
        let request_to_admin = 0;
        let status = 0;
        let placeholder_template_type;
        let is_email_sent = 0;
        let button_option_string = [];
        let sample_content = {};
        let marketing_opt_out = 0;
        let marketing_consent = 0;
        let flowid1 = null;
        let carousel_payload = [];
        let access_token = null;
        let allow_category_change = req.body.allow_category_change;
        let type_of_marketing = null;
        let marketing_template_format;
        let dynamic_url = [];
        let userid;
        let responceaxios;
        let resststus;
        let body_type1;
        let bodyplaceholdersS;
        let urlindex;
        let header_handlerquery;
        let head_media_url111;
        let head_media_url221;
        let head_media_url1;
        let ComponentsData1;
        let resubmit_counter;
        let waba_approval_response_id;
        let headerew;
        let category_change;

        let ltoexpiration = 0;
        let ltotext = null;
        let lto_expiration_time_flag = 0;
        if (allow_category_change === true) {

            category_change = '1';
        } if (allow_category_change === false) {

            category_change = '0';
        } if (!allow_category_change) {
            category_change = null;
        }
        if (category === "MARKETING") {
            type_of_marketing = 1;
        } else {
            type_of_marketing = 0;
        }




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
                message: 'id is required as parameter in URL',
                data: {}
            };
        }

        //validating api
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
                //getting system access token
                // const getSystemAccessTokenResult = await user.getSystemAccessToken();

                // access_token = getSystemAccessTokenResult.VALUE;

                // getting waba_id
                const getwabaidResult = await user.fetchWabaId(apikey);
                const wabaId = getwabaidResult;
                const selectWabaIdResult = await user.selectwabaId(wabaId);
                console.log("Select WabaId Result ====> ", selectWabaIdResult[0][0]);
                //getting access token
                if (selectWabaIdResult[0][0].c === 1) {
                    const getSystemAccessTokenResult = await user.getAccessTokenByWabaId(wabaId);
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

                userid = null;

                let objData = {
                    access_token,
                    name,
                    language,
                    category,
                    components
                };
                let getusersv3 = await userService1.get_userid_by_waba_approval_response_id(id);

                if (getusersv3[0][0] === undefined) {

                    return res.status(401).send({
                        code: 100,
                        status: "failed",
                        message: "Authentication Failed"
                    });
                } else {

                    userid = getusersv3[0][0].auserid;

                    //meta api for editing template
                    let create_templateresult = await whatsappService.post_gen_api(objData, id);

                    responceaxios = null;
                    resststus = null;


                    if (create_templateresult.data === undefined) {

                        responceaxios = create_templateresult.response.data;
                        resststus = create_templateresult.response.status;

                        return res.status(resststus).send(
                            responceaxios,
                        );
                    }

                    if (create_templateresult.data.success === true) {

                        responceaxios = create_templateresult;
                        sample_content.header_content = null;
                        sample_content.body_content = null;
                        sample_content.dynamic_url = null;

                        if (ComponentsData.findIndex(x => x.type.toLowerCase() === "body") > -1) {
                            let bodyindex = ComponentsData.findIndex(x => x.type.toLowerCase() === "body");
                            body_message = ComponentsData[bodyindex].text;
                            bodyplaceholders = ComponentsData[bodyindex].example != undefined ? [].concat(...ComponentsData[bodyindex].example.body_text) : null;
                            sample_content.body_content = bodyplaceholders;

                            if (body_message.match(/\{\w+\}/g) != null) {
                                bodyplaceholders = body_message.match(/\{\w+\}/g).map(s => s.slice(1, -1));
                                bodyplaceholders = bodyplaceholders.map(Number).filter((value, index, self) => self.indexOf(value) === index).toString();

                            }

                            components.push({
                                type: 'BODY',
                                text: ComponentsData[bodyindex].text,
                                example: ComponentsData[bodyindex].example
                            });
                        }
                        if (ComponentsData.findIndex(x => x.type.toLowerCase() === "footer") > -1) {
                            let footerindex = ComponentsData.findIndex(x => x.type.toLowerCase() === "footer");
                            footer_text = ComponentsData[footerindex].text;
                            if (footer_text == 'Not interested? Tap Stop promotions') {
                                marketing_opt_out = 1;
                                marketing_consent = 1;
                            }
                            components.push({
                                type: 'FOOTER',
                                text: ComponentsData[footerindex].text
                            });

                        }
                        if (ComponentsData.findIndex(x => x.type.toLowerCase() === "carousel") > -1) {

                            let carouselindex = ComponentsData.findIndex(x => x.type.toLowerCase() === "carousel");



                            for (let i = 0; i < ComponentsData[carouselindex].cards.length; i++) {
                                let body_messagecard = null;
                                let body_message1 = null;
                                let bodyplaceholdersS1 = null;

                                // let carousel_payload = [];
                                let quick_reply = carousel_payload.button;
                                let visit_website = carousel_payload.button;

                                if (ComponentsData[carouselindex].cards[i].components.findIndex(x => x.type.toLowerCase() === "body") > -1
                                ) {
                                    let carouselbodyindex = ComponentsData[carouselindex].cards[i].components.findIndex(x => x.type.toLowerCase() === "body");
                                    body_type1 = ComponentsData[carouselindex].cards[i].components[carouselbodyindex].type;
                                    body_messagecard = ComponentsData[carouselindex].cards[i].components[carouselbodyindex].text;
                                    body_message1 = ComponentsData[carouselindex].cards[i].components[carouselbodyindex].example;

                                    bodyplaceholdersS = body_message1 != undefined ? body_message1.body_text[0] : null;
                                    bodyplaceholdersS1 = body_message1 != undefined ? body_message1.body_text[0] : "";
                                    if (body_messagecard.match(/\{\w+\}/g) != null) {
                                        bodyplaceholdersS = body_messagecard.match(/\{\w+\}/g).map(s => s.slice(1, -1));
                                        bodyplaceholdersS = bodyplaceholdersS.map(Number).filter((value, index, self) => self.indexOf(value) === index).toString();
                                    }

                                }
                                if (ComponentsData[carouselindex].cards[i].components.findIndex(x => x.type.toLowerCase() === "buttons") > -1) {
                                    let carouselbuttonindex = ComponentsData[carouselindex].cards[i].components.findIndex(x => x.type.toLowerCase() === "buttons");
                                    let ComponentsData1 = ComponentsData[carouselindex].cards[i].components[carouselbuttonindex];
                                    let urldata = ComponentsData1.buttons;

                                    if (urldata.findIndex(x => x.type.toLowerCase() === "quick_reply") > -1) {
                                        quick_reply = {
                                            "button_text": urldata[0].text
                                        };
                                    }
                                    if (urldata.findIndex(x => x.type.toLowerCase() === "url") > -1) {
                                        urlindex = urldata.findIndex(x => x.type.toLowerCase() === "url");
                                        urlplaceholder = urldata[urlindex].example != undefined ? urldata[urlindex].example[0] : null;
                                        sample_content.dynamic_url = urldata[urlindex].example != null ? urldata[urlindex].example : null;
                                        if (urlplaceholder != null && urlplaceholder.length > 0) {
                                            visit_website = {
                                                "button_text": urldata[urlindex].text,
                                                "button_url": urldata[urlindex].url,
                                                "url_sample_content": urldata[urlindex].example[0]
                                            };
                                        } else {
                                            visit_website = {
                                                "button_text": urldata[urlindex].text,
                                                "button_url": urldata[urlindex].url,
                                                "url_sample_content": null
                                            };
                                        }
                                    }

                                }
                                if (ComponentsData[carouselindex].cards[i].components.findIndex(x => x.type.toLowerCase() === "header") > -1) {
                                    let carouselheaderindex = ComponentsData[carouselindex].cards[i].components.findIndex(x => x.type.toLowerCase() === "header");
                                    let ComponentsData1 = ComponentsData[carouselindex].cards[i].components[carouselheaderindex];

                                    let headerindex = (ComponentsData1.format.toLowerCase() === "header");
                                    let hasImage = (ComponentsData1.format.toLowerCase() === "image");
                                    let hasVideo = (ComponentsData1.format.toLowerCase() === "video");

                                    if (hasImage) {
                                        console.log("======has image=");
                                        if (ComponentsData1.example != undefined) {
                                            if (ComponentsData1.example.header_handle != undefined) {
                                                header_handlerquery = ComponentsData1.example.header_handle[0];


                                                if (header_handlerquery) {

                                                    let get_URL_headerhandelresult = await userService1.get_URL_headerhandel(header_handlerquery);
                                                    console.log("=============>get_URL_headerhandelresult", get_URL_headerhandelresult);

                                                    head_media_url111 = get_URL_headerhandelresult[0];
                                                    head_media_url221 = get_URL_headerhandelresult;

                                                    if (head_media_url221.length > 0) {

                                                        head_media_url1 = head_media_url111.url;
                                                        sample_content.header_content = null;
                                                        sample_content.dynamic_url = null;
                                                        head_temptype = 1;
                                                        head_mediatype = "6";
                                                        head_mediatypec = "1";
                                                        button_option_string = null;



                                                        carousel_payload[i] = ({
                                                            "media_type": head_mediatypec,
                                                            "media_url": head_media_url1,
                                                            "body": body_messagecard,
                                                            "body_sample_content": bodyplaceholdersS1,
                                                            "buttons": { visit_website, quick_reply, }
                                                        });

                                                        objData = {
                                                            access_token,
                                                            name,
                                                            language,
                                                            category,
                                                            allow_category_change,
                                                            components: components
                                                        };

                                                        let imagedata = {
                                                            id,
                                                            userid,
                                                            head_media_url,
                                                            head_media_filename,
                                                            head_temptype,
                                                            head_mediatype,
                                                            body_messagecard,
                                                            body_message,
                                                            body_message1,
                                                            button_option,
                                                            head_text_title,
                                                            footer_text,
                                                            button_option,
                                                            request_to_admin,
                                                            sample_content,
                                                            placeholder_template_type,
                                                            name,
                                                            language,
                                                            category,
                                                            button_option_string,
                                                            status,
                                                            bodyplaceholders,
                                                            urlplaceholder,
                                                            headerplaceholder,
                                                            is_email_sent,
                                                            marketing_opt_out,
                                                            marketing_consent
                                                        };
                                                        datares = imagedata;


                                                    }
                                                    else if (get_URL_headerhandelresult.length == 0) {
                                                        head_media_url1 = image_url;
                                                        sample_content.header_content = null;
                                                        sample_content.dynamic_url = null;
                                                        head_temptype = 1;
                                                        head_mediatype = "6";
                                                        head_mediatypec = "1";
                                                        button_option_string = null;



                                                        carousel_payload[i] = ({
                                                            "media_type": head_mediatypec,
                                                            "media_url": head_media_url1,
                                                            "body": body_messagecard,
                                                            "body_sample_content": bodyplaceholdersS1,
                                                            "buttons": { visit_website, quick_reply, }
                                                        });

                                                        objData = {
                                                            access_token,
                                                            name,
                                                            language,
                                                            category,
                                                            allow_category_change,
                                                            components: components
                                                        };

                                                        let imagedata = {
                                                            id,
                                                            userid,
                                                            head_media_url,
                                                            head_media_filename,
                                                            head_temptype,
                                                            head_mediatype,
                                                            body_messagecard,
                                                            body_message,
                                                            body_message1,
                                                            button_option,
                                                            head_text_title,
                                                            footer_text,
                                                            button_option,
                                                            request_to_admin,
                                                            sample_content,
                                                            placeholder_template_type,
                                                            name,
                                                            language,
                                                            category,
                                                            button_option_string,
                                                            status,
                                                            bodyplaceholders,
                                                            urlplaceholder,
                                                            headerplaceholder,
                                                            is_email_sent,
                                                            marketing_opt_out,
                                                            marketing_consent
                                                        };
                                                        datares = imagedata;
                                                    }
                                                    else {

                                                        res.send({
                                                            code: "WA100",
                                                            status: 'Failed',
                                                            message: 'Correct Header Handle is Required Image for card ' + i,

                                                        });

                                                    }

                                                } else {
                                                    res.send({
                                                        code: "WA100",
                                                        status: 'Failed',
                                                        message: 'Correct Header Handle is Required',

                                                    });
                                                }


                                            } else {
                                                res.send({
                                                    code: "WA100",
                                                    status: 'Failed',
                                                    message: 'Header Handle is Required for Image carousel',
                                                });
                                            }
                                        } else {
                                            res.send({
                                                code: "WA100",
                                                status: 'Failed',
                                                message: 'Example is Required for Header Image carousel',
                                            });
                                        }

                                    }
                                    else if (hasVideo) {
                                        console.log('========has video=======');
                                        if (ComponentsData1.example != undefined) {
                                            if (ComponentsData1.example.header_handle != undefined) {
                                                header_handlerquery = ComponentsData1.example.header_handle[0];
                                                /// console.log("HEADER HANDLE", header_handlerquery);
                                                if (header_handlerquery) {
                                                    let get_URL_headerhandelresult = await userService1.get_URL_headerhandel(header_handlerquery);
                                                    console.log("=============>get_URL_headerhandelresult", get_URL_headerhandelresult);
                                                    head_media_url111 = get_URL_headerhandelresult[0];
                                                    head_media_url221 = get_URL_headerhandelresult;


                                                    if (head_media_url221.length > 0) {


                                                        head_media_url1 = head_media_url111.url;
                                                        sample_content.header_content = null;
                                                        sample_content.dynamic_url = null;
                                                        head_temptype = 1;
                                                        head_mediatype = "6";
                                                        head_mediatypec = "2";
                                                        button_option_string = null;
                                                        carousel_payload[i] = ({
                                                            "media_type": head_mediatypec,
                                                            "media_url": head_media_url1,
                                                            "body": body_messagecard,

                                                            "body_sample_content": bodyplaceholdersS1,
                                                            // bodyplaceholdersS1,
                                                            "buttons": { visit_website, quick_reply }


                                                        });

                                                        objData = {
                                                            access_token,
                                                            name,
                                                            language,
                                                            category,
                                                            allow_category_change,
                                                            components: components
                                                        };
                                                        let videodata = {
                                                            id,
                                                            userid,
                                                            head_media_url,
                                                            head_media_filename,
                                                            head_temptype,
                                                            head_mediatype,
                                                            body_messagecard,
                                                            body_message,
                                                            body_message1,
                                                            button_option,
                                                            head_text_title,
                                                            footer_text,
                                                            button_option,
                                                            request_to_admin,
                                                            sample_content,
                                                            placeholder_template_type,
                                                            name,
                                                            language,
                                                            category,
                                                            button_option_string,
                                                            status,
                                                            bodyplaceholders,
                                                            urlplaceholder,
                                                            headerplaceholder,
                                                            is_email_sent,
                                                            marketing_opt_out,
                                                            marketing_consent


                                                        };
                                                        datares = videodata;

                                                    }
                                                    else if (get_URL_headerhandelresult.length == 0) {
                                                        head_media_url1 = video_url;
                                                        sample_content.header_content = null;
                                                        sample_content.dynamic_url = null;
                                                        head_temptype = 1;
                                                        head_mediatype = "6";
                                                        head_mediatypec = "2";
                                                        button_option_string = null;
                                                        carousel_payload[i] = ({
                                                            "media_type": head_mediatypec,
                                                            "media_url": head_media_url1,
                                                            "body": body_messagecard,

                                                            "body_sample_content": bodyplaceholdersS1,
                                                            // bodyplaceholdersS1,
                                                            "buttons": { visit_website, quick_reply }


                                                        });

                                                        objData = {
                                                            access_token,
                                                            name,
                                                            language,
                                                            category,
                                                            allow_category_change,
                                                            components: components
                                                        };
                                                        let videodata = {
                                                            id,
                                                            userid,
                                                            head_media_url,
                                                            head_media_filename,
                                                            head_temptype,
                                                            head_mediatype,
                                                            body_messagecard,
                                                            body_message,
                                                            body_message1,
                                                            button_option,
                                                            head_text_title,
                                                            footer_text,
                                                            button_option,
                                                            request_to_admin,
                                                            sample_content,
                                                            placeholder_template_type,
                                                            name,
                                                            language,
                                                            category,
                                                            button_option_string,
                                                            status,
                                                            bodyplaceholders,
                                                            urlplaceholder,
                                                            headerplaceholder,
                                                            is_email_sent,
                                                            marketing_opt_out,
                                                            marketing_consent

                                                        };
                                                        datares = videodata;
                                                    } else {
                                                        res.send({
                                                            code: "WA100",
                                                            status: 'failed',
                                                            message: 'Proper header handler required',

                                                        });
                                                    }
                                                } else {
                                                    res.send({
                                                        code: "WA100",
                                                        status: 'Failed',
                                                        message: 'Correct Header Handle is Required',

                                                    });
                                                }
                                            } else {
                                                res.send({
                                                    code: "WA100",
                                                    status: 'Failed',
                                                    message: 'Header Handle is Required for Video carousel',
                                                });
                                            }
                                        } else {
                                            res.send({
                                                code: "WA100",
                                                status: 'Failed',
                                                message: 'Example is Required for Header Video carousel',
                                            });
                                        }
                                    }
                                }
                            }


                        }
                        if (ComponentsData.findIndex(x => x.type.toLowerCase() === "limited_time_offer") > -1) {

                            let LTOindex = ComponentsData.findIndex(x => x.type.toLowerCase() === "limited_time_offer"); //lto template
                            type_of_marketing = 3;
                            marketing_template_format = 1;

                            ltotext = ComponentsData[LTOindex].limited_time_offer.text;
                            ltoexpiration = ComponentsData[LTOindex].limited_time_offer.has_expiration;


                            if (ltoexpiration === undefined) {
                                lto_expiration_time_flag = 2;
                            } if (ltoexpiration === true) {
                                lto_expiration_time_flag = 1;
                            }
                            // console.log("log :- ltoexpiration----",ltoexpiration);    
                            // true is 1 and 0 is false
                        }

                        if (ComponentsData.findIndex(x => x.type.toLowerCase() === "buttons") > -1) {

                            let buttonindex = ComponentsData.findIndex(x => x.type.toLowerCase() === "buttons");

                            let urldata = ComponentsData[buttonindex].buttons;
                            let button_type = ComponentsData[buttonindex].type;

                            for (let i = 0; i < urldata.length; i++) {

                                if (urldata[i].type.toLowerCase() === "quick_reply") {
                                    let tmpButtonBody = {
                                        "quick_reply": urldata[i].text
                                    };
                                    button_option_string.push(tmpButtonBody);
                                }
                                if (urldata[i].type.toLowerCase() === "url") {
                                    urlplaceholder = urldata[i].example != undefined ? urldata[i].example[0] : null;


                                    if (urldata[i].example != null ? urldata[i].example : null) {


                                        dynamic_url.push(
                                            urlplaceholder

                                        );
                                    }
                                    sample_content.dynamic_url = dynamic_url;
                                    if (urlplaceholder != null && urlplaceholder.length > 0) {
                                        button_option_string.push({
                                            "visit_website": {
                                                "web_button_text": urldata[i].text,
                                                "web_url_option": "1",
                                                "web_url": urldata[i].url
                                            }
                                        });
                                    } else {
                                        button_option_string.push({
                                            "visit_website": {
                                                "web_button_text": urldata[i].text,
                                                "web_url_option": "0",
                                                "web_url": urldata[i].url
                                            }
                                        });
                                    }
                                }
                                if (urldata[i].type.toLowerCase() === "phone_number") {
                                    button_option_string.push({
                                        "call_phone": {
                                            "phone_button_text": urldata[i].text,
                                            "phone_number": urldata[i].phone_number
                                        }
                                    });
                                }
                                if (urldata[i].type.toLowerCase() === "copy_code") {
                                    button_option = 0;
                                    insideurlindex1 = urldata.findIndex(x => x.type.toLowerCase() === "copy_code");
                                    button_option_string.push({
                                        "copy_offer_code": {
                                            "offer_button_text": "Copy_code",
                                            "offer_code": urldata[i].example[0],
                                        }
                                    });
                                }
                                if (urldata[i].type.toLowerCase() === "mpm") {

                                    sample_content.dynamic_url = null;
                                    sample_content.header_content = null;
                                    type_of_marketing = 2;
                                    marketing_template_format = 0;

                                    button_option = 0;
                                    insideurlindex2 = urldata.findIndex(x => x.type.toLowerCase() === "mpm");
                                    button_option_string.push({
                                        "launch_catalogue": {
                                            "catalogue_button_text": "View items",
                                            "catalogue_name": ""
                                        }

                                    });
                                }
                                if (urldata[i].type.toLowerCase() === "catalog") {
                                    sample_content.dynamic_url = null;
                                    sample_content.header_content = null;
                                    type_of_marketing = 2;
                                    marketing_template_format = 1;
                                    button_option = 0;
                                    let insideurlindexcatalog = urldata.findIndex(x => x.type.toLowerCase() === "catalog");
                                    button_option_string.push({
                                        "launch_catalogue": {
                                            "catalogue_button_text": "View catalog",
                                            "catalogue_name": ""
                                        }

                                    });
                                }
                                if (urldata[i].type.toLowerCase() === "flow") {

                                    let insideurlindexflow = urldata.findIndex(x => x.type.toLowerCase() === "flow");
                                    flowid1 = urldata[insideurlindexflow].flow_id;

                                    let tmpButtonBody = {
                                        type: 'BUTTONS',
                                        buttons: urldata[insideurlindexflow]
                                    };
                                    button_option_string.push(tmpButtonBody);

                                }
                            }
                        }
                        if (ComponentsData.findIndex(x => x.type.toLowerCase() === "header") > -1) {
                            let headerindex = ComponentsData.findIndex(x => x.type.toLowerCase() === "header");
                            ComponentsData1 = ComponentsData[headerindex].format.trim();
                            if ((ComponentsData1 != undefined && ComponentsData1 != "")) {
                                let hasImage = (ComponentsData1.toLowerCase() === "image");
                                let hasText = (ComponentsData1.toLowerCase() === "text");
                                let hasVideo = (ComponentsData1.toLowerCase() === "video");
                                let hasDocument = (ComponentsData1.toLowerCase() === "document");
                                let hasLocation = (ComponentsData1.toLowerCase() === "location");
                                if (hasImage) {
                                    if (ComponentsData[headerindex].example != undefined) {
                                        if (ComponentsData[headerindex].example.header_handle != undefined) {
                                            header_handlerquery = ComponentsData[headerindex].example.header_handle[0];

                                            if (header_handlerquery) {
                                                let get_URL_headerhandelresult = await userService1.get_URL_headerhandel(header_handlerquery);


                                                head_media_url111 = get_URL_headerhandelresult[0];
                                                head_media_url221 = get_URL_headerhandelresult;
                                                if (head_media_url221.length > 0) {


                                                    head_media_url = head_media_url111.url;

                                                    sample_content.header_content = null;
                                                    head_temptype = 1;
                                                    head_mediatype = 1;

                                                    headerew = ComponentsData[headerindex].example;


                                                    objData = {
                                                        access_token,
                                                        name,
                                                        language,
                                                        category,
                                                        allow_category_change,
                                                        components: components

                                                    };


                                                    let imagedata = {
                                                        id,
                                                        userid,
                                                        head_media_url,
                                                        head_media_filename,
                                                        head_temptype,
                                                        head_mediatype,
                                                        body_message,
                                                        button_option,
                                                        head_text_title,
                                                        footer_text,
                                                        button_option,
                                                        request_to_admin,
                                                        sample_content,
                                                        placeholder_template_type,
                                                        name,
                                                        language,
                                                        category,
                                                        button_option_string,
                                                        status,
                                                        bodyplaceholders,
                                                        urlplaceholder,
                                                        headerplaceholder,
                                                        is_email_sent,
                                                        marketing_opt_out,
                                                        marketing_consent

                                                    };
                                                    datares = imagedata;




                                                }
                                                else if (get_URL_headerhandelresult.length == 0) {
                                                    head_media_url = image_url;
                                                    sample_content.header_content = null;
                                                    head_temptype = 1;
                                                    head_mediatype = 1;

                                                    headerew = ComponentsData[headerindex].example;


                                                    objData = {
                                                        access_token,
                                                        name,
                                                        language,
                                                        category,
                                                        allow_category_change,
                                                        components: components

                                                    };


                                                    let imagedata = {
                                                        id,
                                                        userid,
                                                        head_media_url,
                                                        head_media_filename,
                                                        head_temptype,
                                                        head_mediatype,
                                                        body_message,
                                                        button_option,
                                                        head_text_title,
                                                        footer_text,
                                                        button_option,
                                                        request_to_admin,
                                                        sample_content,
                                                        placeholder_template_type,
                                                        name,
                                                        language,
                                                        category,
                                                        button_option_string,
                                                        status,
                                                        bodyplaceholders,
                                                        urlplaceholder,
                                                        headerplaceholder,
                                                        is_email_sent,
                                                        marketing_opt_out,
                                                        marketing_consent

                                                    };
                                                    datares = imagedata;

                                                } else {
                                                    res.send({
                                                        code: "WA100",
                                                        status: 'failed',
                                                        message: 'Proper header handler required',

                                                    });
                                                }

                                            } else {
                                                res.send({
                                                    code: "WA100",
                                                    status: 'Failed',
                                                    message: 'Correct Header Handle is Required',

                                                });
                                            }

                                        } else {
                                            res.send({
                                                code: "WA100",
                                                status: 'Failed',
                                                message: 'Header Handle is Required for Image',
                                            });
                                        }
                                    } else {
                                        res.send({
                                            code: "WA100",
                                            status: 'Failed',
                                            message: 'Example is Required for Header Image',
                                        });
                                    }
                                }
                                else if (hasVideo) {
                                    if (ComponentsData[headerindex].example != undefined) {
                                        if (ComponentsData[headerindex].example.header_handle != undefined) {
                                            header_handlerquery = ComponentsData[headerindex].example.header_handle[0];
                                            if (header_handlerquery) {
                                                let get_URL_headerhandelresult = await userService1.get_URL_headerhandel(header_handlerquery);
                                                console.log("get_URL_headerhandelresult====>", get_URL_headerhandelresult);

                                                head_media_url111 = get_URL_headerhandelresult[0];
                                                head_media_url221 = get_URL_headerhandelresult;
                                                if (head_media_url221.length > 0) {



                                                    head_media_url = head_media_url111.url;

                                                    sample_content.header_content = null;
                                                    head_temptype = 1;
                                                    head_mediatype = 2;
                                                    headerew = ComponentsData[headerindex].example;



                                                    objData = {
                                                        access_token,
                                                        name,
                                                        language,
                                                        category,
                                                        allow_category_change,
                                                        components: JSON.stringify(components)

                                                    };

                                                    let videodata = {
                                                        id,
                                                        userid,
                                                        head_media_url,
                                                        head_media_filename,
                                                        head_temptype,
                                                        head_mediatype,
                                                        body_message,
                                                        button_option,
                                                        head_text_title,
                                                        footer_text,
                                                        button_option,
                                                        request_to_admin,
                                                        sample_content,
                                                        placeholder_template_type,
                                                        name,
                                                        language,
                                                        category,
                                                        button_option_string,
                                                        status,
                                                        bodyplaceholders,
                                                        urlplaceholder,
                                                        headerplaceholder,
                                                        is_email_sent,
                                                        marketing_opt_out,
                                                        marketing_consent
                                                    };
                                                    datares = videodata;




                                                } else if (get_URL_headerhandelresult.length == 0) {
                                                    head_media_url = video_url;

                                                    sample_content.header_content = null;
                                                    head_temptype = 1;
                                                    head_mediatype = 2;
                                                    headerew = ComponentsData[headerindex].example;



                                                    objData = {
                                                        access_token,
                                                        name,
                                                        language,
                                                        category,
                                                        allow_category_change,
                                                        components: JSON.stringify(components)

                                                    };

                                                    let videodata = {
                                                        id,
                                                        userid,
                                                        head_media_url,
                                                        head_media_filename,
                                                        head_temptype,
                                                        head_mediatype,
                                                        body_message,
                                                        button_option,
                                                        head_text_title,
                                                        footer_text,
                                                        button_option,
                                                        request_to_admin,
                                                        sample_content,
                                                        placeholder_template_type,
                                                        name,
                                                        language,
                                                        category,
                                                        button_option_string,
                                                        status,
                                                        bodyplaceholders,
                                                        urlplaceholder,
                                                        headerplaceholder,
                                                        is_email_sent,
                                                        marketing_opt_out,
                                                        marketing_consent
                                                    };
                                                    datares = videodata;
                                                } else {
                                                    res.send({
                                                        code: "WA100",
                                                        status: 'failed',
                                                        message: 'Proper header handler required',

                                                    });
                                                }

                                            } else {
                                                res.send({
                                                    code: "WA100",
                                                    status: 'Failed',
                                                    message: 'Correct Header Handle is Required',

                                                });
                                            }

                                        } else {
                                            res.send({
                                                code: "WA100",
                                                status: 'Failed',
                                                message: 'Header Handle is Required for Video',
                                            });
                                        }
                                    } else {
                                        res.send({
                                            code: "WA100",
                                            status: 'Failed',
                                            message: 'Example is Required for Header Video',
                                        });
                                    }

                                }
                                else if (hasDocument) {
                                    if (ComponentsData[headerindex].example != undefined) {
                                        if (ComponentsData[headerindex].example.header_handle != undefined) {
                                            header_handlerquery = ComponentsData[headerindex].example.header_handle[0];
                                            if (header_handlerquery) {
                                                let get_URL_headerhandelresult = await userService1.get_URL_headerhandel(header_handlerquery);


                                                head_media_url111 = get_URL_headerhandelresult[0];
                                                head_media_url221 = get_URL_headerhandelresult;

                                                if (head_media_url221.length > 0) {

                                                    head_media_url = head_media_url111.url;

                                                    sample_content.header_content = null;
                                                    head_temptype = 1;
                                                    head_mediatype = 0;
                                                    headerew = ComponentsData[headerindex].example;



                                                    objData = {
                                                        access_token,
                                                        name,
                                                        language,
                                                        category,
                                                        allow_category_change,
                                                        components: JSON.stringify(components)
                                                    };

                                                    let documentdata = {
                                                        id,
                                                        userid,
                                                        head_media_url,
                                                        head_media_filename,
                                                        head_temptype,
                                                        head_mediatype,
                                                        body_message,
                                                        button_option,
                                                        head_text_title,
                                                        footer_text,
                                                        button_option,
                                                        request_to_admin,
                                                        sample_content,
                                                        placeholder_template_type,
                                                        name,
                                                        language,
                                                        category,
                                                        button_option_string,
                                                        status,
                                                        bodyplaceholders,
                                                        urlplaceholder,
                                                        headerplaceholder,
                                                        is_email_sent,
                                                        marketing_opt_out,
                                                        marketing_consent
                                                    };
                                                    datares = documentdata;

                                                } else if (get_URL_headerhandelresult.length == 0) {
                                                    head_media_url = document_url;

                                                    sample_content.header_content = null;
                                                    head_temptype = 1;
                                                    head_mediatype = 0;
                                                    headerew = ComponentsData[headerindex].example;



                                                    objData = {
                                                        access_token,
                                                        name,
                                                        language,
                                                        category,
                                                        allow_category_change,
                                                        components: JSON.stringify(components)
                                                    };

                                                    let documentdata = {
                                                        id,
                                                        userid,
                                                        head_media_url,
                                                        head_media_filename,
                                                        head_temptype,
                                                        head_mediatype,
                                                        body_message,
                                                        button_option,
                                                        head_text_title,
                                                        footer_text,
                                                        button_option,
                                                        request_to_admin,
                                                        sample_content,
                                                        placeholder_template_type,
                                                        name,
                                                        language,
                                                        category,
                                                        button_option_string,
                                                        status,
                                                        bodyplaceholders,
                                                        urlplaceholder,
                                                        headerplaceholder,
                                                        is_email_sent,
                                                        marketing_opt_out,
                                                        marketing_consent
                                                    };
                                                    datares = documentdata;
                                                } else {
                                                    res.send({
                                                        code: "WA100",
                                                        status: 'failed',
                                                        message: 'Proper header handler required',

                                                    });
                                                }

                                            } else {
                                                res.send({
                                                    code: "WA100",
                                                    status: 'Failed',
                                                    message: 'Correct Header Handle is Required',

                                                });
                                            }


                                        } else {
                                            res.send({
                                                code: "WA100",
                                                status: 'Failed',
                                                message: 'Header Handle is Required for Document',
                                            });
                                        }
                                    } else {
                                        res.send({
                                            code: "WA100",
                                            status: 'Failed',
                                            message: 'Example is Required for Header Document',
                                        });
                                    }

                                }
                                else if (hasLocation) {

                                    head_temptype = 1;
                                    head_mediatype = 5;


                                    objData = {
                                        access_token,
                                        name,
                                        language,
                                        category,
                                        allow_category_change,
                                        components: JSON.stringify(components)

                                    };

                                    let locationdata = {
                                        id,
                                        userid,
                                        head_media_url,
                                        head_media_filename,
                                        head_temptype,
                                        head_mediatype,
                                        body_message,
                                        button_option,
                                        head_text_title,
                                        footer_text,
                                        button_option,
                                        request_to_admin,
                                        sample_content,
                                        placeholder_template_type,
                                        name,
                                        language,
                                        category,
                                        button_option_string,
                                        status,
                                        bodyplaceholders,
                                        urlplaceholder,
                                        headerplaceholder,
                                        is_email_sent,
                                        marketing_opt_out,
                                        marketing_consent
                                    };
                                    datares = locationdata;

                                }
                                else if (hasText) {

                                    head_temptype = 0;
                                    headerplaceholder = ComponentsData[headerindex].example != undefined ? ComponentsData[headerindex].example.header_text : null;
                                    sample_content.header_content = ComponentsData[headerindex].example != null ? ComponentsData[headerindex].example.header_text : null;



                                    objData = {
                                        access_token,
                                        name,
                                        language,
                                        category,
                                        allow_category_change,
                                        components: components

                                    };

                                    head_text_title = ComponentsData[headerindex].text;
                                    let textdata = {
                                        id,
                                        userid,
                                        head_media_url,
                                        head_media_filename,
                                        head_temptype,
                                        head_mediatype,
                                        body_message,
                                        button_option,
                                        head_text_title,
                                        footer_text,
                                        button_option,
                                        request_to_admin,
                                        sample_content,
                                        name,
                                        language,
                                        category,
                                        placeholder_template_type,
                                        button_option_string,
                                        status,
                                        bodyplaceholders,
                                        urlplaceholder,
                                        headerplaceholder,
                                        is_email_sent,
                                        marketing_opt_out,
                                        marketing_consent
                                    };
                                    datares = textdata;

                                }
                            } else {
                                res.send({
                                    code: "WA100",
                                    status: 'Failed',
                                    message: 'Format is Required for Header',
                                });
                            }
                        }
                        if (ComponentsData.findIndex(x => x.type.toLowerCase() === "header") === -1 && ComponentsData.findIndex(x => x.type.toLowerCase() === "carousel") === -1) {

                            objData = {
                                access_token,
                                name,
                                language,
                                category,
                                allow_category_change,
                                components: components

                            };
                            head_temptype = null;
                            let textdata = {
                                id,
                                userid,
                                head_media_url,
                                head_media_filename,
                                head_temptype,
                                head_mediatype,
                                body_message,
                                button_option,
                                head_text_title,
                                footer_text,
                                button_option,
                                request_to_admin,
                                sample_content,
                                placeholder_template_type,
                                name,
                                language,
                                category,
                                button_option_string,
                                status,
                                bodyplaceholders,
                                urlplaceholder,
                                headerplaceholder,
                                is_email_sent,
                                marketing_opt_out,
                                marketing_consent
                            };
                            datares = textdata;



                        }
                        //updating bodyplaceholders type
                        if (datares !== null && datares.bodyplaceholders != null && datares.urlplaceholder == null && datares.headerplaceholder == null) {
                            datares.placeholder_template_type = 3;
                        } else if (datares !== null && datares.bodyplaceholders != null && datares.urlplaceholder != null && datares.headerplaceholder != null) {
                            datares.placeholder_template_type = 1;
                        } else if (datares !== null && datares.bodyplaceholders != null && datares.urlplaceholder == null && datares.headerplaceholder != null) {
                            datares.placeholder_template_type = 2;
                        } else if (datares !== null && datares.bodyplaceholders != null && datares.urlplaceholder != null && datares.headerplaceholder == null) {
                            datares.placeholder_template_type = 4;
                        } else if (datares !== null && datares.bodyplaceholders == null && datares.urlplaceholder != null && datares.headerplaceholder == null) {
                            datares.placeholder_template_type = 4;
                        } else if (datares !== null && datares.bodyplaceholders == null && datares.urlplaceholder == null && datares.headerplaceholder != null) {
                            datares.placeholder_template_type = 2;
                        } else if (datares !== null && datares.bodyplaceholders == null && datares.urlplaceholder == null && datares.headerplaceholder == null) {
                            datares.placeholder_template_type = 0;
                        } else if (datares !== null && datares.bodyplaceholders == null && datares.urlplaceholder != null && datares.headerplaceholder != null) {
                            datares.placeholder_template_type = 1;
                        }

                        let status112 = 0;

                        let tempstatus = responceaxios.data.success;
                        if (tempstatus === true) {

                            status112 = 14;
                        }

                        waba_approval_response_id = id;
                        resubmit_counter = 0;

                        //update the edited template data in database 
                        await userService1.updateTemplateDetails(waba_approval_response_id, resubmit_counter, datares, carousel_payload, flowid1, status112, type_of_marketing, marketing_template_format, lto_expiration_time_flag, ltotext);

                        infoLogger.info(JSON.stringify(responceaxios.data));
                        console.log("responceaxios.data================", JSON.stringify(responceaxios.data));
                        return res.status(200).send(
                            responceaxios.data,
                        );
                    }
                }

            }
        }

    } catch (error) {
        errorLogger.error(JSON.stringify(error.message));
        return res.status(500).send(error.message);
    }

};
