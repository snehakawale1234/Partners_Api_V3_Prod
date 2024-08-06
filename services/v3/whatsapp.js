const botUtils = require('../../utils/bot');
const botUtils3 = require('../../utils/botv3');
const fs = require('fs/promises');
const fs1 = require('fs');
const config = require('../../config');
const FormData = require('form-data');
const {
    Console
} = require('console');

const create_template = async (objData, wabaid) => {
    try {
        const instanceUrl = config.graphFacebookUrl;
        const api = '/v18.0/' + wabaid + '/message_templates';
        const httpMethod = 1;
        const requestType = 1;
        const apiHeaders = [];
        const response = await botUtils3.callWhatsAppApiMedia(instanceUrl, api, objData, httpMethod, requestType, apiHeaders);

        return response;

    } catch (error) {
        return error;
    }
};
const payments_refund = async (objData, id) => {
    try {
        const instanceUrl = config.graphFacebookUrl;
        const api = '/v18.0/' + id + '/payments_refund';
        const httpMethod = 1;
        const requestType = 1;
        const apiHeaders = [];
        const response = await botUtils3.callWhatsAppApiSend(instanceUrl, api, objData, httpMethod, requestType, apiHeaders);

        return response;

    } catch (error) {
        return error;
    }
};

const getPaymentStatus = async (objData, apiu) => {
    try {
        console.log("===========getPaymentStatus===========");
        let accesstoken = objData.access_token;
        const instanceUrl = config.graphFacebookUrl;
        const api = apiu;
        const httpMethod = 0;
        const requestType = 0;
        const apiHeaders = [{
            'headerName': 'Authorization',
            'headerVal': 'Bearer ' + accesstoken
        }
        ];
        const response = await botUtils3.getPaymentStatus(instanceUrl, api, httpMethod, requestType, apiHeaders);
        return response;


    } catch (error) {
        return error;
    }

};

const sharedWabaInfo = async (tsp_accesstoken_val, endpoint) => {
    try {
        console.log("inside shared wabainfo ");
        const instanceUrl = config.graphFacebookUrl;
        const api = `v20.0/${endpoint}`;
        console.log("===============>", tsp_accesstoken_val);
        console.log("=================>", api);
        const httpMethod = 0;
        const requestType = 0;
        const apiHeaders = [{
            headerName: 'Authorization',
            headerVal: 'Bearer ' + tsp_accesstoken_val
        }];
        const response = await botUtils3.sharedWaba(instanceUrl, api, httpMethod, requestType, apiHeaders);
        // console.log("============>response", response.data);
        return response;

    } catch (error) {
        return error;
    }
};

const send_template = async (objData, id) => {
    try {

        const instanceUrl = config.graphFacebookUrl;
        const api = '/v18.0/' + id + '/messages';
        const httpMethod = 1;
        const requestType = 1;
        const apiHeaders = [];
        const response = await botUtils3.callWhatsAppApiSend(instanceUrl, api, objData, httpMethod, requestType, apiHeaders);

        return response;

    } catch (error) {
        return error;
    }
};

const get_template1 = async (objData, wabaid, stringified) => {
    try {
        const instanceUrl = config.graphFacebookUrl;
        const api = '/v18.0/' + wabaid + '/message_templates' + '?' + stringified;

        const httpMethod = 0;
        const requestType = 1;
        const apiHeaders = [];
        // const objData= null;
        const response = await botUtils3.callWhatsAppApiMedia(instanceUrl, api, objData, httpMethod, requestType, apiHeaders);

        return response;

    } catch (error) {
        return error;
    }
};

const get_template2 = async (objData, id, stringified) => {
    try {
        const instanceUrl = config.graphFacebookUrl;
        const api = '/v18.0/' + id + '?' + stringified;
        const httpMethod = 0;
        const requestType = 1;
        const apiHeaders = [];
        const response = await botUtils.callWhatsAppApiMedia(instanceUrl, api, objData, httpMethod, requestType, apiHeaders);
        return response;

    } catch (error) {
        return error;
    }
};
const createSessionmedia1 = async (objData, stringified) => {
    try {
        const instanceUrl = config.graphFacebookUrl;
        const api = '/v18.0/app/uploads' + '?' + stringified;
        const httpMethod = 1;
        const requestType = 1;
        const apiHeaders = [];
        const response = await botUtils3.callWhatsAppApiMedia(instanceUrl, api, objData, httpMethod, requestType, apiHeaders);
        return response;

    } catch (error) {
        return error;
    }
};
const post_gen_api = async (objData, wabaid,) => {
    try {

        const instanceUrl = config.graphFacebookUrl;
        const api = 'v18.0/' + wabaid;
        const httpMethod = 1;
        const requestType = 1;
        const apiHeaders = [];
        const response = await botUtils3.callWhatsAppApiMedia(instanceUrl, api, objData, httpMethod, requestType, apiHeaders);
        return response;

    } catch (error) {
        return error;
    }
};
const uploads = async (id, access_token, filedata, FileType) => {
    try {

        const instanceUrl = config.graphFacebookUrl;
        const api = 'v18.0/';

        const apiHeaders = [{
            'headerName': 'Authorization',
            'headerVal': 'OAuth ' + access_token
        },
        {
            'headerName': 'Content-Type',
            'headerVal': FileType
        }
        ];


        const upload = await botUtils.uploadTemplate(instanceUrl, api, id, filedata, apiHeaders);

        return upload;


    } catch (error) {
        return error;
    }
};
const getmediaseddiondetails = async (id, access_token) => {
    try {

        const instanceUrl = config.graphFacebookUrl;
        const api = 'v18.0/';
        const apiHeaders = [{
            'headerName': 'Authorization',
            'headerVal': 'OAuth ' + access_token
        }
        ];
        const httpMethod = 0;
        const requestType = 0;


        const upload = await botUtils3.callWhatsAppApiGET(id, instanceUrl, api, httpMethod, requestType, apiHeaders);

        return upload;


    } catch (error) {
        return error;
    }
};
const deleteTemplate = async (access_token, Id, query1) => {
    try {
        const apiHeaders = [];


        const rows = await botUtils3.deleteWhatsappTemplate(access_token, Id, query1, apiHeaders);

        return rows;
    } catch (error) {
        return error;
    }
};
const deleteMedia = async (mediaid, SystemAccessToken) => {
    try {

        const instanceUrl = 'https://graph.facebook.com';
        const api = '/v19.0/' + mediaid;

        const apiHeaders = [
            {
                'headerName': 'Authorization',
                'headerVal': 'Bearer ' + SystemAccessToken
            }
        ];


        const deleteMediacloudresult = await botUtils3.deleteMediaCloud(instanceUrl + api, apiHeaders);
        return deleteMediacloudresult;
    } catch (error) {

        throw error;
    }
};
const deleteMediaCloud = async (instanceUrl, apiHeaders) => {

    let url = instanceUrl;
    let headers = {
        'cache-control': 'no-cache'
    };
    let len = apiHeaders.length;
    for (let y = 0; y < len; ++y) {
        let obj = apiHeaders[y];
        headers[obj.headerName] = obj.headerVal;
    }
    return new Promise(function (resolve, reject) {
        let config = {
            method: 'DELETE',
            maxBodyLength: Infinity,
            url: url,
            headers: headers
        };
        let protocol = httpUrl.parse(url).protocol;
        if (protocol != null && protocol == "https:") {
            config.httpsAgent = new https.Agent({
                keepAlive: true,
                rejectUnauthorized: false
            }); //secureProtocol: 'TLSv1_method'
        } else {
            config.httpAgent = new http.Agent({
                keepAlive: true,
                rejectUnauthorized: false
            }); //secureProtocol: 'TLSv1_method'
        }
        const instance = axios.create(config);
        try {
            instance.delete(url).then(function (response) {

                resolve(response);
            }).catch(function (error) {
                reject(error);
            });
        } catch (e) {
            reject(e);
        }
    });
};
const downloadCloudMedia = async (url, SystemAccessToken, next) => {
    try {
        const instanceUrl = url;



        const httpMethod = 0;
        const requestType = 0;
        const apiHeaders = [
            {
                'headerName': 'Authorization',
                'headerVal': 'Bearer ' + SystemAccessToken
            },
            {
                'headerName': 'Content-Type',
                'headerVal': 'application/json'
            }
        ];


        const result = await botUtils3.downloadWhatsappMediaCloud(instanceUrl, apiHeaders);

        return result;
    } catch (error) {

        // console.error("Error:", error);

        throw error;
    }
};

const getMediaUrl = async (mediaid, SystemAccessToken) => {
    try {

        const instanceUrl = 'https://graph.facebook.com';
        const api = '/v13.0/' + mediaid;

        const apiHeaders = [
            {
                'headerName': 'Authorization',
                'headerVal': 'Bearer ' + SystemAccessToken
            },
            {
                'headerName': 'Content-Type',
                'headerVal': 'application/json'
            }
        ];

        const mediaData = await botUtils3.getMediaUrlCloud(instanceUrl + api, apiHeaders);

        return mediaData;
    } catch (error) {
        // Handle the error here
        console.error("Error:", error);

        throw error;
    }
};

const createFlowV3 = async (objData, apiu) => {
    try {

        const instanceUrl = config.graphFacebookUrl;
        const api = apiu;
        const httpMethod = 1;
        const requestType = 1;
        const apiHeaders = [];
        const response = await botUtils3.callWhatsAppApiSend(instanceUrl, api, objData, httpMethod, requestType, apiHeaders);

        return response;

    } catch (error) {
        return error;
    }
};


const messageFlowJSON = async (token, flowID, objData1, obj2) => {
    console.log("objData1------------------->", objData1);

    const instanceUrl = config.graphFacebookUrl;
    const api = 'v18.0/' + flowID + '/assets';

    const apiHeaders = [{
        headerName: 'Authorization',
        headerVal: 'Bearer ' + token
    }];

    function appendObjectToFormData(obj) {
        const form = new FormData();

        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                form.append(key, obj[key]);
            }

        }

        return form;
    }

    const objData = appendObjectToFormData(objData1);
    objData.append('file', obj2);



    try {
        let response = await botUtils.uploadTemplate(instanceUrl + api, '', '', objData, apiHeaders);



        return response;
    } catch (error) {
        return error;
    }

};

const getreq1_V3 = async (objData, apiu) => {
    try {
        const instanceUrl = config.graphFacebookUrl;
        const api = apiu;
        const httpMethod = 0;
        const requestType = 0;
        const apiHeaders = [];
        const response = await botUtils3.callWhatsAppApiSend(instanceUrl, api, objData, httpMethod, requestType, apiHeaders);

        return response;


    } catch (error) {
        return error;
    }
};

const postreq1_V3 = async (objData, apiu) => {
    try {

        const instanceUrl = config.graphFacebookUrl;
        const api = apiu;
        const httpMethod = 1;
        const requestType = 1;
        const apiHeaders = [];
        const response = await botUtils3.callWhatsAppApiSend(instanceUrl, api, objData, httpMethod, requestType, apiHeaders);

        return response;

    } catch (error) {
        return error;
    }
};

const batchapicall = async (objData, catalogid,) => {
    try {

        const instanceUrl = config.graphFacebookUrl;
        const api = 'v18.0/' + catalogid + "/batch";
        const httpMethod = 1;
        const requestType = 1;
        const apiHeaders = [{
            'headerName': 'Content-Type',
            'headerVal': 'application/json'
        }];
        const response = await botUtils3.callWhatsAppApibatch(instanceUrl, api, objData, httpMethod, requestType, apiHeaders);
        return response;

    } catch (error) {
        return error;
    }
};

const getallwabaapi = async (token, apiurl) => {
    try {
        console.log("-------------------------------------------------->", token, apiurl);
        const instanceUrl = config.graphFacebookUrl;
        const api = 'v20.0/' + apiurl;
        const httpMethod = 1;
        const requestType = 1;
        const apiHeaders = [{
            headerName: 'Authorization',
            headerVal: 'Bearer ' + token
        }];
        const response = await botUtils3.callWhatsAppApigetallwaba(instanceUrl, api, httpMethod, requestType, apiHeaders);
        return response;

    } catch (error) {
        return error;
    }
};

const searchproduct = async (access_token, Id, query1) => {
    try {
        const apiHeaders = [{
            headerName: 'Authorization',
            headerVal: 'Bearer ' + access_token
        }];


        const rows = await botUtils3.searchProductTemplate(access_token, Id, query1, apiHeaders);
        // console.log("delete template query ====> ", rows);
        return rows;
    } catch (error) {
        return error;
    }
};

const SetBusinessPublicKey = async (token, phonenumberid, business_public_key) => {
    // console.log({ token, phonenumberid, business_public_key });
    const instanceUrl = config.graphFacebookUrl;
    const api = 'v18.0/' + phonenumberid + '/whatsapp_business_encryption';
    const httpMethod = 1;
    const requestType = 1;
    const apiHeaders = [{
        headerName: 'Authorization',
        headerVal: 'Bearer ' + token
    }];
    let objData = new FormData();
    objData.append('business_public_key', business_public_key);
    try {
        const response = await botUtils3.uploadTemplate(instanceUrl + api, '', '', objData, apiHeaders);
        // console.log("=======>response", response);
        return response;
    } catch (error) {
        return error;
    }


};




module.exports = {

    create_template,
    get_template1,
    get_template2,
    createSessionmedia1,
    post_gen_api,
    uploads,
    getmediaseddiondetails,
    deleteTemplate,
    send_template,
    payments_refund,
    deleteMedia,
    deleteMediaCloud,
    downloadCloudMedia,
    getMediaUrl,
    createFlowV3,
    messageFlowJSON,
    getreq1_V3,
    postreq1_V3,
    getPaymentStatus,
    searchproduct,
    batchapicall,
    SetBusinessPublicKey,
    sharedWabaInfo,
    getallwabaapi

};