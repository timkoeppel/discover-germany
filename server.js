/*
UTILITIES
 */
const path = require('path');
const https = require('https');
const fs = require('fs');

/*
WEBSERVER
 */
const options = {
    key: fs.readFileSync('./discover-germany.de+4-key.pem'),
    cert: fs.readFileSync('./discover-germany.de+4.pem')
};

const express = require('express');
const app = express();
const http_server = https.createServer(options, app);

// public root
app.use(express.static(path.resolve(__dirname, 'public')));

// start server
const PORT = 5000;
http_server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

/*
WEBSOCKET COMMUNICATION
 */
const RequestManager = require('./app/RequestManager');
require('dotenv').config();
const io = require('socket.io')(http_server, cookie=false);

io.on('connection', socket => {
    socket.on('request', (IN, callback) => {
        // make sure that there is a callback function
        if (typeof callback !== 'function') {
            callback = () => {
            };
        }
        RequestManager.handleRequest(IN.type, IN.data)
            .then(result => {
                callback({
                    success: true,
                    data: result
                });
            })
            .catch(error => {
                callback({
                    success: false,
                    message: error
                });
            });
    });
});