const multer = require('fastify-multer');
const fs = require('fs/promises');
const wamessagesRouterV3 = require('./v3/wamessages');
const upload = multer({
    storage: multer.diskStorage({
        destination: async (req, file, cb) => {
            //in case of error directory was created
            await fs.access(`assets`).catch(async err => {
                await fs.mkdir(`assets`);
            });
            await fs.access(`assets/watemplates`).catch(async err => {
                await fs.mkdir(`assets/watemplates`);
            });
            await fs.access(`assets/watemplates`).catch(async err => {
                await fs.mkdir(`assets/watemplates`);
            });

            cb(null, `assets/watemplates`);
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    })
});

module.exports = (fastify) => {
    fastify.register(multer.contentParser);
    fastify.register(wamessagesRouterV3(upload), { prefix: 'v3' });
};