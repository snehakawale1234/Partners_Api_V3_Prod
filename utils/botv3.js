var validator = require('validator');
var crypto = require('crypto');
var phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();
const axios = require('axios');
/* WhatsApp Biz API */
var urlencode = require('urlencode');
var http = require('http');
var https = require('https');
var httpUrl = require('url');
var qs = require("querystring");
var Promise = require('promise');
var fileType = require('file-type');
var moment = require('moment');
const uuidv4 = require('uuid').v4;
const config = require('../config');
const { resolve } = require('path');
const { rejects } = require('assert');
/* WhatsApp Biz API */
// var mysql = require('../dbcon');

module.exports = {

    callWhatsAppApiMedia: function (instanceUrl, api, data, httpMethod, requestType, apiHeaders) {
        var url = instanceUrl + api;
        var httpMethod = parseInt(httpMethod);
        var requestType = parseInt(requestType);
        var postData = {};
        var getData = {};
        if (httpMethod == 0) {
            if (requestType == 0) {
                getData = data;
            } else {
                // getData = "Bearer"+data;
            }
        } else {
            postData = (requestType == 0) ? qs.stringify(data) : data;
        }
        var contentType = (requestType == 0) ? 'application/x-www-form-urlencoded' : 'application/json; charset=utf-8';
        var headers = {
            'Content-Type': contentType,
            'Authorization': 'Bearer ' + data.access_token,
            'Authorization': 'OAuth ' + data.access_token,
            'cache-control': 'no-cache'
        };
        // console.log("datadatadatadatadata",data);
        var len = apiHeaders.length;
        for (var y = 0; y < len; ++y) {
            var obj = apiHeaders[y];
            headers[obj.headerName] = obj.headerVal;
        }
        // if (httpMethod == 1) {
        //     postData = (requestType == 0) ? qs.stringify(postData) : postData;
        // }
        return new Promise(function (resolve, reject) {
            var options = {
                url: api,
                method: (httpMethod == 1) ? 'POST' : 'GET',
                baseURL: instanceUrl,
                // timeout: 10000,
                responseType: 'json',
                responseEncoding: 'utf8',
                headers: headers,
                // params: {fields, limit,status}
            };
            var protocol = httpUrl.parse(url).protocol;
            if (protocol != null && protocol == "https:") {
                options.httpsAgent = new https.Agent({
                    keepAlive: true,
                    rejectUnauthorized: false
                }); //secureProtocol: 'TLSv1_method'
            } else {
                options.httpAgent = new http.Agent({
                    keepAlive: true,
                    rejectUnauthorized: false
                }); //secureProtocol: 'TLSv1_method'
            }
            if (httpMethod == 1) { //POST
                options.data = postData;
            } else {
                // options.headers = getData;
            }
            const instance = axios.create(options);
            try {
                if (httpMethod == 1) { //POST
                    instance.post(url, postData).then(function (response) {
                        resolve(response);
                    }).catch(function (error) {
                        //console.log(error);
                        reject(error);
                    });
                } else { //GET
                    instance.get(url, {
                        getData
                    }).then(function (response) {
                        resolve(response);
                    }).catch(function (error) {
                        console.log('BOTUTIL_ERROR');
                        // console.log(error);
                        reject(error);
                    });
                }
            } catch (e) {
                return reject(e);
            }
        });
    },
    uploadTemplate: function (instanceUrl, api, id, data, apiHeaders) {
        // console.log(data);
        let url = instanceUrl + api + id;
        let headers = {
            'cache-control': 'no-cache'
        };
        let len = apiHeaders.length;
        for (let y = 0; y < len; ++y) {
            let obj = apiHeaders[y];
            headers[obj.headerName] = obj.headerVal;
        }
        return new Promise(function (resolve, reject) {
            var options = {
                url: api,
                method: 'POST',
                baseURL: instanceUrl,
                headers: headers,
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            };
            options.data = data;
            let protocol = httpUrl.parse(url).protocol;
            if (protocol != null && protocol == "https:") {
                options.httpsAgent = new https.Agent({
                    keepAlive: false,
                    rejectUnauthorized: false
                }); //secureProtocol: 'TLSv1_method'
            } else {
                options.httpAgent = new http.Agent({
                    keepAlive: false,
                    rejectUnauthorized: false
                }); //secureProtocol: 'TLSv1_method'
            }
            const instance = axios.create(options);
            try {
                instance.post(url, data).then(function (response) {
                    resolve(response);
                }).catch(function (error) {
                    reject(error);
                });
            } catch (e) {
                reject(e);
            }
        });
    },
    getmedtaTemplate: function (instanceUrl, api, id, data, apiHeaders) {
        console.log("inside getmedtaTemplate");
        // console.log(data);
        let url = instanceUrl + api + id;
        console.log("url''''--------------------------->", url);
        let headers = {
            'cache-control': 'no-cache'
        };
        let len = apiHeaders.length;
        for (let y = 0; y < len; ++y) {
            let obj = apiHeaders[y];
            headers[obj.headerName] = obj.headerVal;
        }
        return new Promise(function (resolve, reject) {
            var options = {
                url: api,
                method: 'GET',
                baseURL: instanceUrl,
                headers: headers,
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            };
            options.data = data;
            let protocol = httpUrl.parse(url).protocol;
            if (protocol != null && protocol == "https:") {
                options.httpsAgent = new https.Agent({
                    keepAlive: false,
                    rejectUnauthorized: false
                }); //secureProtocol: 'TLSv1_method'
            } else {
                options.httpAgent = new http.Agent({
                    keepAlive: false,
                    rejectUnauthorized: false
                }); //secureProtocol: 'TLSv1_method'
            }
            const instance = axios.create(options);
            try {
                instance.get(url, data).then(function (response) {
                    resolve(response);
                }).catch(function (error) {
                    reject(error);
                });
            } catch (e) {
                reject(e);
            }
        });
    },
    callWhatsAppApiGET: function (id, instanceUrl, api, httpMethod, requestType, apiHeaders) {
        var url = instanceUrl + api + id;
        var httpMethod = parseInt(httpMethod);
        var requestType = parseInt(requestType);
        var getData = {};
        var httpMethod = 0;
        var requestType = 0;

        var contentType = (requestType == 0) ? 'application/x-www-form-urlencoded' : 'application/json';
        var headers = {
            'Content-Type': contentType,
            'cache-control': 'no-cache'
        };
        var len = apiHeaders.length;
        for (var y = 0; y < len; ++y) {
            var obj = apiHeaders[y];
            headers[obj.headerName] = obj.headerVal;
        }

        return new Promise(function (resolve, reject) {
            var options = {
                url: api,
                method: (httpMethod == 1) ? 'POST' : 'GET',
                baseURL: instanceUrl,
                timeout: 3000,
                responseType: 'json',
                responseEncoding: 'utf8',
                headers: headers,
            };
            var protocol = httpUrl.parse(url).protocol;
            if (protocol != null && protocol == "https:") {
                options.httpsAgent = new https.Agent({
                    keepAlive: true,
                    rejectUnauthorized: false
                }); //secureProtocol: 'TLSv1_method'
            } else {
                options.httpAgent = new http.Agent({
                    keepAlive: true,
                    rejectUnauthorized: false
                }); //secureProtocol: 'TLSv1_method'
            }

            options.params = getData;

            const instance = axios.create(options);
            try {
                instance.get(url, {
                    getData
                }).then(function (response) {
                    resolve(response.data);
                }).catch(function (error) {
                    reject(error);
                });
            } catch (e) {
                return reject(e);
            }
        });
    },
    deleteWhatsappTemplate: function (access_token, Id, query1, apiHeaders) {
        const instanceUrl = config.graphFacebookUrl;
        let url = `${instanceUrl}/v18.0/${Id}/message_templates?${query1}`;


        let headers = {
            'cache-control': 'no-cache',
            'Authorization': 'Bearer ' + access_token,
        };
        let len = apiHeaders.length;

        console.log("url ======> " + url, len);

        for (let y = 0; y < len; ++y) {
            let obj = apiHeaders[y];
            headers[obj.headerName] = obj.headerVal;
        }
        return new Promise(function (resolve, reject) {
            var options = {
                url: url,
                method: 'DELETE',
                baseURL: instanceUrl,
                headers: headers,
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            };
            let protocol = httpUrl.parse(url).protocol;
            if (protocol != null && protocol == "https:") {
                options.httpsAgent = new https.Agent({
                    keepAlive: true,
                    rejectUnauthorized: false
                }); //secureProtocol: 'TLSv1_method'
            } else {
                options.httpAgent = new http.Agent({
                    keepAlive: true,
                    rejectUnauthorized: false
                }); //secureProtocol: 'TLSv1_method'
            }
            const instance = axios.create(options);
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
    },

    getMediaUrlCloud: function (instanceUrl, apiHeaders) {
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
            var options = {
                url: instanceUrl,
                method: 'GET',
                baseURL: instanceUrl,
                headers: headers,
                responseType: 'arraybuffer',
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            };
            let protocol = httpUrl.parse(url).protocol;
            if (protocol != null && protocol == "https:") {
                options.httpsAgent = new https.Agent({
                    keepAlive: true,
                    rejectUnauthorized: false
                }); //secureProtocol: 'TLSv1_method'
            } else {
                options.httpAgent = new http.Agent({
                    keepAlive: true,
                    rejectUnauthorized: false
                }); //secureProtocol: 'TLSv1_method'
            }
            const instance = axios.create(options);
            try {
                instance.get(url).then(function (response) {
                    resolve(response);
                }).catch(function (error) {
                    reject(error);
                });
            } catch (e) {
                reject(e);
            }
        });
    },
    downloadWhatsappMediaCloud: function (instanceUrl, apiHeaders) {
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
            var options = {
                url: instanceUrl,
                method: 'GET',
                baseURL: instanceUrl,
                headers: headers,
                responseType: 'arraybuffer',
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            };
            let protocol = httpUrl.parse(url).protocol;
            if (protocol != null && protocol == "https:") {
                options.httpsAgent = new https.Agent({
                    keepAlive: true,
                    rejectUnauthorized: false
                }); //secureProtocol: 'TLSv1_method'
            } else {
                options.httpAgent = new http.Agent({
                    keepAlive: true,
                    rejectUnauthorized: false
                }); //secureProtocol: 'TLSv1_method'
            }
            const instance = axios.create(options);
            try {
                instance.get(url).then(function (response) {
                    resolve(response);
                }).catch(function (error) {
                    reject(error);
                });
            } catch (e) {
                reject(e);
            }
        });
    },

    deleteMediaCloud: async (instanceUrl, apiHeaders) => {

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
    },

    uploadWhatsappMediaCloud: function (instanceUrl, data, apiHeaders) {
        // console.log(instanceUrl, data, apiHeaders);
        let api = '/media';
        let url = instanceUrl + api;
        let headers = {
            'cache-control': 'no-cache',
            ...data.getHeaders()
        };
        let len = apiHeaders.length;
        for (let y = 0; y < len; ++y) {
            let obj = apiHeaders[y];
            headers[obj.headerName] = obj.headerVal;
        }
        return new Promise(function (resolve, reject) {
            var options = {
                url: instanceUrl,
                method: 'POST',
                baseURL: api,
                headers: headers,
                // maxContentLength: Infinity,
                maxBodyLength: Infinity,
            };
            options.data = data;
            // console.log('uploadWhatsappMediaCloud======================================>' + JSON.stringify(data));
            let protocol = httpUrl.parse(url).protocol;
            if (protocol != null && protocol == "https:") {
                options.httpsAgent = new https.Agent({
                    keepAlive: true,
                    rejectUnauthorized: false
                }); //secureProtocol: 'TLSv1_method'
            } else {
                options.httpAgent = new http.Agent({
                    keepAlive: true,
                    rejectUnauthorized: false
                }); //secureProtocol: 'TLSv1_method'
            }
            const instance = axios.create(options);
            try {

                instance.post(url, data).then(function (response) {

                    resolve(response.data);
                }).catch(function (error) {
                    reject(error);
                });
            } catch (e) {
                reject(e);
            }
        });
    },

    getMediaUrlCloud: function (instanceUrl, apiHeaders) {
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
            var options = {
                url: instanceUrl,
                method: 'GET',
                baseURL: instanceUrl,
                headers: headers,
                responseType: 'arraybuffer',
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            };
            let protocol = httpUrl.parse(url).protocol;
            if (protocol != null && protocol == "https:") {
                options.httpsAgent = new https.Agent({
                    keepAlive: true,
                    rejectUnauthorized: false
                }); //secureProtocol: 'TLSv1_method'
            } else {
                options.httpAgent = new http.Agent({
                    keepAlive: true,
                    rejectUnauthorized: false
                }); //secureProtocol: 'TLSv1_method'
            }
            const instance = axios.create(options);
            try {
                instance.get(url).then(function (response) {
                    resolve(response);
                }).catch(function (error) {
                    reject(error);
                });
            } catch (e) {
                reject(e);
            }
        });
    },


    callWhatsAppApiSend: function (instanceUrl, api, data, httpMethod, requestType, apiHeaders) {
        console.log({ instanceUrl, api, data, httpMethod, requestType, apiHeaders });
        var url = instanceUrl + api;
        // var url = "http://146.190.10.76/v1/112672835072002/messages";
        var httpMethod = parseInt(httpMethod);
        var requestType = parseInt(requestType);
        var postData = {};
        var getData = {};
        if (httpMethod == 0) {
            if (requestType == 0) {
                getData = data;
            } else {
                // getData = "Bearer"+data;
            }
        } else {
            // postData = (requestType == 0) ? qs.stringify(data) : data;
            postData = data.body;
            // /console.log(postData);
        }
        var contentType = (requestType == 0) ? 'application/x-www-form-urlencoded' : 'application/json; charset=utf-8';
        var headers = {
            'Content-Type': contentType,
            'Authorization': 'Bearer ' + data.access_token,
            'Authorization': 'OAuth ' + data.access_token,
            'cache-control': 'no-cache'
        };
        // console.log("datadatadatadatadata",data);
        var len = apiHeaders.length;
        for (var y = 0; y < len; ++y) {
            var obj = apiHeaders[y];
            headers[obj.headerName] = obj.headerVal;
        }
        // if (httpMethod == 1) {
        //     postData = (requestType == 0) ? qs.stringify(postData) : postData;
        // }
        return new Promise(function (resolve, reject) {
            var options = {
                url: api,
                method: (httpMethod == 1) ? 'POST' : 'GET',
                baseURL: instanceUrl,
                // timeout: 10000,
                responseType: 'json',
                responseEncoding: 'utf8',
                headers: headers,
                // params: {fields, limit,status}
            };
            var protocol = httpUrl.parse(url).protocol;
            if (protocol != null && protocol == "https:") {
                options.httpsAgent = new https.Agent({
                    keepAlive: true,
                    rejectUnauthorized: false
                }); //secureProtocol: 'TLSv1_method'
            } else {
                options.httpAgent = new http.Agent({
                    keepAlive: true,
                    rejectUnauthorized: false
                }); //secureProtocol: 'TLSv1_method'
            }
            if (httpMethod == 1) { //POST
                options.data = postData;
            } else {
                // options.headers = getData;
            }
            const instance = axios.create(options);
            try {
                if (httpMethod == 1) { //POST
                    instance.post(url, postData).then(function (response) {

                        resolve(response);
                    }).catch(function (error) {
                        //console.log(error);
                        reject(error);
                    });
                } else { //GET
                    instance.get(url, {
                        getData
                    }).then(function (response) {
                        resolve(response);
                    }).catch(function (error) {
                        console.log('BOTUTIL_ERROR');
                        console.log(error);
                        reject(error);
                    });
                }
            } catch (e) {
                return reject(e);
            }
        });
    },

    getPaymentStatus: async function (instanceUrl, api, httpMethod, requestType, apiHeaders) {
        console.log("inside getPayment status==========================");

        // Prepare headers object
        let headers = {};
        for (let obj of apiHeaders) {
            headers[obj.headerName] = obj.headerVal;
        }
        console.log({ headers });

        // Construct the full URL
        var options = {
            baseURL: instanceUrl,
            headers: headers,
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        };
        const instance = axios.create(options);

        // Return a promise to handle the asynchronous operation
        return new Promise((resolve, reject) => {
            instance.get(api)
                .then(response => {
                    console.log("API Response:", response);
                    resolve(response); // Resolving with the response data
                })
                .catch(error => {
                    return reject(error); // Rejecting with the error
                });
        });
    },

    sharedWaba: async function (instanceUrl, api, httpMethod, requestType, apiHeaders) {
        console.log("======inside shared waba");
        let headers = {};
        for (let obj of apiHeaders) {
            headers[obj.headerName] = obj.headerVal;
        }

        for (let obj of apiHeaders) {
            headers[obj.headerName] = obj.headerVal;
        }
        console.log({ headers });
        var options = {
            baseURL: instanceUrl,
            headers: headers,
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        };
        const instance = axios.create(options);


        return new Promise((resolve, reject) => {
            instance.get(api)
                .then(response => {
                    resolve(response); // Resolving with the response data
                })
                .catch(error => {
                    return reject(error); // Rejecting with the error
                });
        });

    },

    callWhatsAppApigetallwaba: async function (instanceUrl, api, httpMethod, requestType, apiHeaders) {
        console.log("======inside shared waba");
        let headers = {};
        for (let obj of apiHeaders) {
            headers[obj.headerName] = obj.headerVal;
        }

        for (let obj of apiHeaders) {
            headers[obj.headerName] = obj.headerVal;
        }
        console.log({ headers });
        var options = {
            baseURL: instanceUrl,
            headers: headers,
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        };

        // console.log("options ------------------------------------>v3------------------------> ", options)
        const instance = axios.create(options);


        return new Promise((resolve, reject) => {
            instance.get(api)
                .then(response => {
                    resolve(response); // Resolving with the response data
                })
                .catch(error => {
                    return reject(error); // Rejecting with the error
                });
        });

    },


    callWhatsAppApibatch: function (instanceUrl, api, objData, httpMethod, requestType, apiHeaders) {

        let url = instanceUrl + api;
        let headers = {
            'cache-control': 'no-cache'
        };
        let len = apiHeaders.length;
        for (let y = 0; y < len; ++y) {
            let obj = apiHeaders[y];
            headers[obj.headerName] = obj.headerVal;
        }
        return new Promise(function (resolve, reject) {
            var options = {
                url: api,
                method: 'POST',
                baseURL: instanceUrl,
                headers: headers,
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            };
            options.data = objData;
            let protocol = httpUrl.parse(url).protocol;
            if (protocol != null && protocol == "https:") {
                options.httpsAgent = new https.Agent({
                    keepAlive: false,
                    rejectUnauthorized: false
                }); //secureProtocol: 'TLSv1_method'
            } else {
                options.httpAgent = new http.Agent({
                    keepAlive: false,
                    rejectUnauthorized: false
                }); //secureProtocol: 'TLSv1_method'
            }
            const instance = axios.create(options);
            try {
                instance.post(url, objData).then(function (response) {
                    resolve(response);
                }).catch(function (error) {
                    reject(error);
                });
            } catch (e) {
                reject(e);
            }
        });
    },
    searchProductTemplate: function (access_token, Id, query1, apiHeaders) {
        console.log("query1 object.keys -----------------------------> ", Object.keys(query1).length);

        const instanceUrl = config.graphFacebookUrl;
        // let url = `${instanceUrl}v20.0/${Id}/products?access_token=${access_token}`;
        let url = `${instanceUrl}v20.0/${Id}/products`;

        if (Object.keys(query1).length > 0) {
            url = `${instanceUrl}v20.0/${Id}/products?${query1}`;
            console.log("inside if of searchProductTemplate ****************************************************************************************");
        }
        //  else {

        //     url = `${instanceUrl}v20.0/${Id}/products?access_token=${access_token}`;
        //     console.log("inside else of searchProductTemplate ****************************************************************************************");
        // }
        console.log("url----------------->", url);
        let headers = {
            'cache-control': 'no-cache',
        };
        let len = apiHeaders.length;

        console.log("url ======> " + url, len);

        for (let y = 0; y < len; ++y) {
            let obj = apiHeaders[y];
            headers[obj.headerName] = obj.headerVal;
        }

        return new Promise(function (resolve, reject) {
            var options = {
                url: url,
                method: 'get',
                baseURL: instanceUrl,
                headers: headers,
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            };
            console.log('==============>', options);
            let protocol = httpUrl.parse(url).protocol;
            if (protocol != null && protocol == "https:") {
                options.httpsAgent = new https.Agent({
                    keepAlive: true,
                    rejectUnauthorized: false
                }); //secureProtocol: 'TLSv1_method'
            } else {
                options.httpAgent = new http.Agent({
                    keepAlive: true,
                    rejectUnauthorized: false
                }); //secureProtocol: 'TLSv1_method'
            }
            const instance = axios.create(options);
            try {
                instance.get(url).then(function (response) {
                    resolve(response);
                }).catch(function (error) {
                    reject(error);
                });
            } catch (e) {
                reject(e);
            }
        });
    }



};