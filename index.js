// Load Modules
const express = require('express');
const http = require('http');
const https = require('https');
const PORT = process.env.PORT || 5000
// ================ SERVER ==================
const app = express();
app.use(express.static('public'));

const http_server = http.createServer(app).listen(PORT, function() {
    console.log(`HTTP Server listening on port  ${ PORT }`);
})