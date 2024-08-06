const fs = require('fs');
const path = require('path');
const log4js = require('log4js');

// Define the log directory
const logDirectory = path.join('/home/logs/', 'partnersV3logs');

// Ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// log4js logger
log4js.configure({
    appenders: {
        "partnersV3_info_logs": {
            "type": "dateFile",
            "filename": path.join(logDirectory, 'partnersV3_info_logs'),
            "pattern": "yyyy-MM-dd.log",
            "alwaysIncludePattern": true
        },
        "partnersV3_error_logs": {
            "type": "dateFile",
            "filename": path.join(logDirectory, 'partnersV3_error_logs'),
            "pattern": "yyyy-MM-dd.log",
            "alwaysIncludePattern": true
        }
    },
    categories: {
        "default": { "appenders": ["partnersV3_error_logs"], "level": "error" },
        "info": { "appenders": ["partnersV3_info_logs"], "level": "info" }
    }
});

const errorLogger = log4js.getLogger('error');
const infoLogger = log4js.getLogger('info');

module.exports = {
    errorLogger,
    infoLogger
};
