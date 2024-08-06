const mongoose = require('mongoose');
require('dotenv').config();

const db_url = process.env.db_url;
// console.log({ db_url });

mongoose.Promise = global.Promise;

const connectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 60000,
    maxPoolSize: 10 // Set the maximum size of the connection pool
};

// Establish the database connection
const db = mongoose.createConnection(db_url, connectOptions);

db.on('error', (error) => {
    console.error('Error in MongoDB connection:', error);
});

db.on('connected', () => {
    console.log('Connected to MongoDB ===========> ', db_url);
});


db.on('customEvent', () => {
    console.log('Closing MongoDB connection');
    db.close(() => {
        console.log('MongoDB connection closed');
    });
});

// Export the database connection object
module.exports = db;