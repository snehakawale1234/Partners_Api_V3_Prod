const dbpool = require('../../db/database.js');
const async = require('async');
const user = require('../../services/v3/user.js');
const whatsappService = require('../../services/v3/whatsapp.js');
const userService1 = require('../../services/v3/userStat.js');
let buss_domain_url = process.env.buss_domain_url;
let axios = require('axios');
let queryString = require('query-string');
const utils = require('../../utils/bot.js');
const { json } = require('express');
var appLoggers = require('../../apploggerV3.js');
var errorLogger = appLoggers.errorLogger;
var infoLogger = appLoggers.infoLogger;

const batchapi = async (req, res) => {
    try {
        let apikey = req.headers.apikey;
        let catalogid = req.params.catalogid;
        // const { fields, limit, status, after, before } = req.query;
        // query1 = queryString.stringify(req.query);
        let requestbody = req.body;

        if (!req.headers.apikey) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'apikey is required as parameter in header',
                data: {}
            };
        }
        if (!req.params.catalogid) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'catalogid is required as parameter in URL',
                data: {}
            };
        }

        const selectapikeyResult = await user.selectapikey(apikey);

        console.log("selectapikeyResult ====> " + JSON.stringify(selectapikeyResult[0][0].c));
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
                console.log("procided get templte");
                const getSystemAccessTokenResult = await user.getSystemAccessToken();
                console.log(getSystemAccessTokenResult);
                access_token = getSystemAccessTokenResult.VALUE;
                requestbody.access_token = access_token;


                // const stringified = query1


                let batchapicall = await whatsappService.batchapicall(requestbody, catalogid);
                // console.log("batchapicall --------------------------------->", batchapicall.data)
                if (!batchapicall.response) {
                    console.log("insideif---------------------->", batchapicall.data);
                    return res.status(200).send(
                        batchapicall.data
                    );
                } else {
                    console.log("else side------------------------>");
                    return res.status(200).send(
                        batchapicall.response.data,
                    );
                }

            }
        }
    } catch (error) {
        return res.send(error.message);
    }

};

const searchproduct = async (req, res) => {
    try {
        let apikey = req.headers.apikey;
        let catalogid = req.params.catalogid;
        const queryparametsr = req.query;
        let limit = req.query.limit != undefined ? req.query.limit : null;
        let after = req.query.after != undefined ? req.query.after : null;
        let before = req.query.before != undefined ? req.query.before : null;
        query1 = queryString.stringify(req.query);

        if (!req.headers.apikey) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'apikey is required as parameter in header',
                data: {}
            };
        }
        if (!req.params.catalogid) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'catalogid is required as parameter in URL',
                data: {}
            };
        }

        const selectapikeyResult = await user.selectapikey(apikey);

        // console.log("selectapikeyResult ====> " + JSON.stringify(selectapikeyResult[0][0].c));
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

                const getSystemAccessTokenResult = await user.getSystemAccessToken();
                console.log(getSystemAccessTokenResult.VALUE);
                access_token = getSystemAccessTokenResult.VALUE;



                const stringified = query1;

                let searchproductresult = await whatsappService.searchproduct(access_token, catalogid, stringified);
                if (!searchproductresult.response) {

                    if (searchproductresult.data.paging != undefined) {
                        if (searchproductresult.data.paging.next) {
                            searchproductresult.data.paging.next = searchproductresult.data.paging.next.replace(
                                'https://graph.facebook.com/v20.0',
                                buss_domain_url
                            );
                        }
                        if (searchproductresult.data.paging.previous) {
                            searchproductresult.data.paging.previous = searchproductresult.data.paging.previous.replace(
                                'https://graph.facebook.com/v20.0',
                                buss_domain_url
                            );
                        }
                    }
                    infoLogger.info(JSON.stringify(searchproductresult.data));
                    return res.status(200).send(
                        searchproductresult.data,
                    );


                } else {
                    console.log("else side------------------------>");
                    infoLogger.info(JSON.stringify(searchproductresult.response.data));
                    let status = searchproductresult.response.status;
                    return res.status(status).send(
                        searchproductresult.response.data
                    );
                }
            }
        }
    } catch (error) {
        errorLogger.error(JSON.stringify(error.message));
        return res.send(error.message);
    }
};
const fetchcatalogId = async (req, res) => {
    try {

        let apikeys = req.headers.apikey;
        let wanumber = req.headers.wanumber;
        let userid = null;
        wanumber = wanumber.replace("+", "")
        if (wanumber.length == 10) {
            wanumber = "91" + wanumber
        }


        console.log({ apikeys, wanumber });

        if (!req.headers.apikey) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'API Key is required',
                data: {}
            };
        }
        if (!req.headers.wanumber) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'Wanumber Key is required',
                data: {}
            };
        };

        let apikeyResult = await user.getapikeyuserid(apikeys);
        if (apikeyResult != null && apikeyResult[0].length > 0) {
            userid = apikeyResult[0][0].userid;
        } else {
            return res.status(401).send({
                code: '100',
                status: 'FAILED',
                message: 'Correct API Key is required',
                data: {}
            });
        }

        let catalogIdResult = await user.catalogIdget(userid, wanumber);

        console.log("catalogIdResult -------------------------------->  ", JSON.stringify(catalogIdResult[0]))

        if (catalogIdResult != null && catalogIdResult !== undefined && catalogIdResult.length > 0) {
            infoLogger.info(JSON.stringify(catalogIdResult[0]));

            return res.send({
                code: 200,
                status: 'SUCCESS',
                message: "Catalog data fetch successfully",
                data: catalogIdResult[0]
            });
        } else {
            return res.status(404).send({
                message: `No catalog found for the ${wanumber}`,
                data: {}
            });;
        }
    } catch (error) {
        errorLogger.error(JSON.stringify(error.message));
        return res.send(error.message);
    }
};
module.exports = { batchapi, searchproduct, fetchcatalogId };


