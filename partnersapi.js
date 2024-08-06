let app = require('fastify');
let initRoutes = require('./routes');
let port = 2707;
let host = "0.0.0.0";
const assets_folder = require('@fastify/static');
const path = require('path');


var fastify = app({

    logger: false,
    bodyLimit: 100 * 1024 * 1024
});

fastify.register(assets_folder, {
    root: path.join(__dirname, 'assets'),
    prefix: '/public/',
});
fastify.addContentTypeParser('*', { parseAs: 'buffer' }, function (req, body, done) {
    done(null, body);
});



async function start() {
    try {
        initRoutes(fastify);

        fastify.get('/', (req, res) => {
            res.send("PARTNER'S API IS WORKING");
        });

        await fastify.listen({ port: port, host: host }, (err, address) => {
            if (err)
                throw err;
            console.log('Pinnacles API for Partners is listening on port ' + address);
            console.log(__dirname);
        });
    } catch (err) {
        console.log(err);
    }
}
start();