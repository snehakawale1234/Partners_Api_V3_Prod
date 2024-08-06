
const createtemplatecontroller = require('../../controller/v3/create_template.js');
const gettemplatecontroller1 = require('../../controller/v3/gettemplate1.js');
const gettemplatecontroller2 = require('../../controller/v3/gettemplate2.js');
const createSessionmediacontroller = require('../../controller/v3/createSessionmedia.js');
const InitiateUploadcontroller = require('../../controller/v3/initiateupload.js');
const edittemplatecontroller = require('../../controller/v3/editMessagetemplate.js');
const getsessiondetailscontroller = require('../../controller/v3/getsessiondetails.js');
const deletetemplatecontroller = require('../../controller/v3/deletetemplate.js');
const sendmessagecontroller = require('../../controller/v3/sendmessage.js');
const payments_refundcontroller = require('../../controller/v3/payments_refund.js');




const getphoneidcontroller = require('../../controller/v3/getphoneidcontroller');
const uploadmediacontroller = require('../../controller/v3/uploadmediacontroller');
const downloadmediacontroller = require('../../controller/v3/downloadmediacontroller');
const deletemediacontroller = require('../../controller/v3/deletemediacontroller');
const retriveurlcontroller = require('../../controller/v3/retriveurlcontroller');
const downloadmediaurlcontroller = require('../../controller/v3/downloadmediaurlcontroller');

const setwebhookcontroller = require('../../controller/v3/setwebhookcontroller');
const getwebhookcontroller = require('../../controller/v3/getwebhookcontroller');

const setBusinessPublicKeycontroller = require('../../controller/v3/setBusinessPublicKeycontroller.js');
const getBusinessPublicKeycontroller = require('../../controller/v3/getBusinessPublicKeycontroller.js');
const createflowscontroller = require('../../controller/v3/createflowscontroller.js');
const getListofFlowscontroller = require('../../controller/v3/getListofFlowscontroller.js');
const getFlowListofAssetscontroller = require('../../controller/v3/getFlowListofAssetscontroller.js');
const updatingflowsjsoncontroller = require('../../controller/v3/updatingflowsjsoncontroller.js');
const depricateflowscontroller = require('../../controller/v3/depricateflowscontroller.js');
const publishflowscontroller = require('../../controller/v3/publishflowscontroller.js');
const deleteflowscontroller = require("../../controller/v3/deleteflowscontroller.js");
const updatemetadatacontroller = require("../../controller/v3/updatemetadatacontroller.js");
const previewScreencontroller = require("../../controller/v3/previewScreencontroller.js");

const postcalltoactioncontroller = require('../../controller/v3/postcalltoactioncontroller');
const getpaymentStatuscontroller = require('../../controller/v3/getpaymentStatuscontroller');
const setwhatsappbusinessencryptionsController = require('../../controller/v3/setwhatsappbusinessencryptionsController');
const { batchapi, searchproduct,fetchcatalogId } = require('../../controller/v3/catalog.js');
const getPrivateKeyController = require('../../controller/v3/getPrivateKeyController');
const sharedWabaController_1 = require('../../controller/v3/sharedWabaController_1');
const { getallownedWaba_1, GetBusinessProfileId_1 } = require('../../controller/v3/getallownedWaba_1');

const multer = require('fastify-multer');
const fs = require('fs');
const FormData = require('form-data');


module.exports = (upload) => {

    const createtemplateOpts = {
        handler: createtemplatecontroller
    };
    const gettemplateOpts1 = {
        handler: gettemplatecontroller1
    };
    const gettemplateOpts2 = {
        handler: gettemplatecontroller2
    };
    const createSessionmedia = {
        handler: createSessionmediacontroller
    };
    const InitiateUploadOpts = {
        handler: InitiateUploadcontroller
    };
    const edittemplateOpts = {
        handler: edittemplatecontroller
    };
    const getsessiondetailsOpts = {
        handler: getsessiondetailscontroller
    };
    const deletetemplateOpts = {
        handler: deletetemplatecontroller
    };
    const sendmessageOpts = {
        handler: sendmessagecontroller
    };
    const payments_refundOpts = {
        handler: payments_refundcontroller
    };
    const getphoneidOpts = {
        handler: getphoneidcontroller
    };

    const uploadmediaOpts = {
        preHandler: [
            upload.fields([{
                name: 'sheet',
                maxCount: 1
            }])
        ],
        handler: uploadmediacontroller
    };


    const deletemediaOpts = {
        handler: deletemediacontroller
    };

    const retriveurlOpts = {
        handler: retriveurlcontroller
    };

    const downloadmediaurlOpts = {
        handler: downloadmediaurlcontroller
    };

    const downloadmediacontrollerOpts = {
        handler: downloadmediacontroller
    };

    const setwebhookOpts = {
        handler: setwebhookcontroller
    };

    const getwebhookOpts = {
        handler: getwebhookcontroller
    };
    const setBusinessPublicKeyOpts = {
        handler: setBusinessPublicKeycontroller
    };
    const getBusinessPublicKeyOpts = {
        handler: getBusinessPublicKeycontroller
    };
    const createflowsOpts = {
        handler: createflowscontroller
    };
    const getListofFlowsOpts = {
        handler: getListofFlowscontroller
    };
    const getFlowListofAssetsOpts = {
        handler: getFlowListofAssetscontroller
    };
    const UpdatingFlowJSONOpts = {
        preHandler: [
            upload.fields([{
                name: 'file',
                maxCount: 1,
                minCount: 1,
            }])
        ],

        handler: updatingflowsjsoncontroller
    };
    const depricateflowsOpts = {
        handler: depricateflowscontroller
    };
    const publishflowsOpts = {
        handler: publishflowscontroller
    };

    const deleteflowsOpts = {
        handler: deleteflowscontroller
    };

    const updateMetadataOpts = {
        handler: updatemetadatacontroller
    };

    const previewScreenOpts = {
        handler: previewScreencontroller
    };

    const postcalltoactionOpts = {
        handler: postcalltoactioncontroller
    };

    const getpaymentStatusOpts = {
        handler: getpaymentStatuscontroller
    };

    const setwhatsappbusinessencryptionsOpts = {
        handler: setwhatsappbusinessencryptionsController
    };
    const catalogOpts = {
        handler: batchapi
    };
    const productOpts = {
        handler: searchproduct
    };

    const getPrivateKeyOpts = {
        handler: getPrivateKeyController
    };

    const getAllOwnedWABAOpts_1 = {
        handler: getallownedWaba_1
    };

    const sharedWabaOpts_1 = {
        handler: sharedWabaController_1
    };

    const GetBusinessProfileIdOpts_1 = {
        handler: GetBusinessProfileId_1
    };
    const fetchcatalogIdOpts = {
        handler: fetchcatalogId
    };






    return (fastify, opts, done) => {
        fastify.post('/:wabaid/message_templates', createtemplateOpts);//create template
        fastify.get('/:wabaid/message_templates', gettemplateOpts1);//get all template // get templates with filter
        fastify.get('/:id', gettemplateOpts2);//get template on id  //get waba info
        fastify.post('/app/uploads', createSessionmedia);//get upload id
        fastify.post("/:id", edittemplateOpts);//edit templates //Updating Flow's Metadata
        fastify.post("/upload*", InitiateUploadOpts);//get header handler
        fastify.get('/upload*', getsessiondetailsOpts);//getting session details on uplaod id
        fastify.delete("/:id/message_templates", deletetemplateOpts);//delete template with id //delete template with name
        fastify.post("/:id/messages", sendmessageOpts);//send messages
        fastify.post("/:id/payments_refund", payments_refundOpts);//refund api
        fastify.get('/getuserdetails', getphoneidOpts);//getting user details
        fastify.post('/:phoneid/media', uploadmediaOpts);//upload media for id
        fastify.delete('/:mediaid', deletemediaOpts);//delete media //delete flow
        fastify.get('/whatsapp_business/attachments/', downloadmediaurlOpts);//get media url
        fastify.post('/downloadMedia/:mediaid', downloadmediacontrollerOpts);//download media from id
        fastify.post('/:phonenoid/setwebhook', setwebhookOpts);//setwebhook
        fastify.get('/:phonenoid/getwebhook', getwebhookOpts);//getwebhook
        fastify.get('/:mobileno/:campaignid/:placeholder/*', postcalltoactionOpts);//campaign tracking


        //flows
        fastify.post("/flows/:id/whatsapp_business_encryption", setBusinessPublicKeyOpts);
        fastify.get("/flows/:id/whatsapp_business_encryption", getBusinessPublicKeyOpts);
        fastify.post("/flows/:id/flows", createflowsOpts);
        fastify.get("/flows/:id/flows", getListofFlowsOpts);
        fastify.get("/flows/:id/assets", getFlowListofAssetsOpts);
        fastify.post("/flows/:id/assets", UpdatingFlowJSONOpts);
        fastify.post("/flows/:id/deprecate", depricateflowsOpts);
        fastify.post("/flows/:id/publish", publishflowsOpts);
        fastify.delete("/flows/:id", deleteflowsOpts);
        fastify.post("/flows/:id", updateMetadataOpts);
        fastify.get("/flows/:id", previewScreenOpts);
        fastify.post("/flows/:phoneid/set_whatsapp_business_encryption", setwhatsappbusinessencryptionsOpts);
        fastify.get("/flows/:phoneid/get_private_key", getPrivateKeyOpts);

        //payments
        fastify.get("/:phoneid/payments/:payment_configuration/:referenceid", getpaymentStatusOpts);

        // catalog api
        fastify.post('/:catalogid/batch', catalogOpts);//ok
        fastify.get('/:catalogid/products', productOpts);//ok
        fastify.get('/fetchcatalogId', fetchcatalogIdOpts);


        // slot 1 of 47 api
        fastify.get('/:bmid/client_whatsapp_business_accounts', sharedWabaOpts_1);
        fastify.get('/:bmid/owned_whatsapp_business_accounts', getAllOwnedWABAOpts_1);
        fastify.get('/:PhoneNumberId/whatsapp_business_profile', GetBusinessProfileIdOpts_1);

       

        done();
    };
};