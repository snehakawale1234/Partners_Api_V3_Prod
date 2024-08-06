let mongoose = require('mongoose');
let mdbConnection = require('../db/mongoose');
let Schema = mongoose.Schema;

// Fields not segregated yet

const sentMasterSchema = new Schema({
    request_id: { type: Number, default: 0 },
    userid: { type: Number, default: 0 },
    mobileno: { type: Number, default: 0 },
    wabapayload: { type: Object, default: null },
    client_payload: { type: Object, default: null },
    body_content: { type: Object, default: null },
    messageid: { type: String, default: null },
    errcode: { type: Number, default: null },
    errdesc: { type: String, default: null },
    createdt: { type: Date, default: null },
    requestdt: { type: Date, default: null },
    status: { type: Number, default: 0 },
    readstatus: { type: Number, default: 0 },
    sessid: { type: String, default: null },
    sentdt: { type: Date, default: null },
    dlvrddt: { type: Date, default: null },
    readdt: { type: Date, default: null },
    billingdt: { type: Date, default: null },
    messagetype: { type: Number, default: 0 },
    source: { type: Number, default: 0 },
    campaignid: { type: Number, default: 0 },
    contactno: { type: String, default: null },
    msg_setting_id: { type: Number, default: 0 },
    direction: { type: Number, default: 0 },
    faileddt: { type: Date, default: null },
    // deletedt: { type: Date, default: null },
    countrycode: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    // isdeleted: { type: Number, default: 0 },
    billing: { type: Number, default: 0 },
    pricing_model: { type: String, default: null },
    submissiontype: { type: String, default: "NOTIFICATION" },
    retrycount: { type: Number, default: 0 },
    retrydt: { type: Date, default: null },
    ismodified: { type: Number, default: 0 },
    modifieddt: { type: Date, default: null },
    profile_name: { type: String, default: null },
    category: { type: String, default: null },
    expiration_timestamp: { type: Date, default: null },
    isdeducted: { type: Number, default: 0 },
    category_id: { type: Number, default: 0 },
    fbtrace_id: { type: String, default: null },
    batchid: { type: Number, default: 0 },
    uuid: { type: String, default: null },
    kafka_topic: { type: String, default: null },
    sent_master_uuid: { type: String, default: null },
    templateid: { type: Number, default: 0 },
},
    { timestamps: true }
);


module.exports = sentMasterSchema;
