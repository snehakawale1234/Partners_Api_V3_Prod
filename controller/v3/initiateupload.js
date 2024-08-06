require('dotenv').config();

const user = require('../../services/v3/user');
const whatsappService = require('../../services/v3/whatsapp');
const userService1 = require('../../services/v3/userStat');
const moment = require('moment');
var fs = require('fs');
const path = require('path');
var appLoggers = require('../../apploggerV3.js');
var errorLogger = appLoggers.errorLogger;
var infoLogger = appLoggers.infoLogger;


let queryString = require('query-string');
const AWS = require('aws-sdk');

var mime = require('mime-types');
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


const { promisify } = require('util');
module.exports = async (req, res) => {
    try {

        console.log("============ inside initiate upload ===========");

        let query1 = queryString.stringify(req.query);
        let obj = req.params;
        let id = "upload" + obj["*"];
        let head_media_url;


        const fileData = Buffer.from(req.body, 'binary');



        let apikey = req.headers.apikey;
        const writeFileAsync = promisify(fs.writeFile);
        const readFileAsync = promisify(fs.readFile);
        const unlinkAsync = promisify(fs.unlink);


        if (!req.headers.apikey) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'apikey is required as parameter in header',
                data: {}
            };
        }
        if (!req.params) {
            return {
                code: '100',
                status: 'FAILED',
                message: 'id is required as parameter in URL',
                data: {}
            };
        }

        let fileType = req.headers['content-type'];
        const contentType = req.headers['content-type'];
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

                //get user id
                let getusersv3 = await userService1.getUserIdbyapikey(apikey);

                let userid = getusersv3[0][0].userid;

                fileType = req.headers['content-type'];
                obj = req.params;
                id = "upload" + obj["*"] + "?" + query1;

                //meta api called
                const uploadsResult = await whatsappService.uploads(id, access_token, fileData, fileType);


                if (!uploadsResult.response) {


                    const currentDate = moment().format('YYYYMMDDHHmmss');
                    const parts = contentType.split('/');
                    const fileExtension = parts[1];
                    const filePath = path.join(__dirname, `uploads/${currentDate}.${fileExtension}`);


                    fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });
                    const filewrite = await writeFileAsync(filePath, fileData);

                    const fileContent111 = await readFileAsync(filePath);

                    const params = {
                        Bucket: BUCKET_NAME,
                        Key: path.basename(filePath),
                        Body: fileContent111
                    };



                    //upload file on s3 bucket

                    try {
                        const data = await s3.upload(params).promise();

                        await fs.promises.unlink(filePath);

                        const temp = {
                            head_media_url: data.Location
                        };

                        const FileType = mime.lookup(filePath);
                        const head_media_url = data.Location;
                        const h = uploadsResult.h;

                        await userService1.insertheaderdatav3(userid, head_media_url, h, FileType);


                    } catch (err) {
                        return {
                            code: 100,
                            status: "failed",
                            message: "Something went wrong"
                        };
                    }

                    // console.log("uploadsResult==================", uploadsResult);
                    return res.status(200).send(uploadsResult);
                } else {

                    let status123 = uploadsResult.response.status;

                    infoLogger.info(JSON.stringify(uploadsResult.response.data));
                    //console.log("uploadsResult.response.data====================", JSON.stringify(uploadsResult.response.data));
                    return res.status(status123).send(uploadsResult.response.data);
                }
            }
        }

    } catch (error) {

        errorLogger.error(JSON.stringify(error.message.data));
        return res.send(error.message.data);
    }

};



