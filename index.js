// Load Modules
const express = require('express');
const http = require('http');
const https = require('https');
const PORT = process.env.PORT || 5000;
const path = require('path');
// ================ SERVER ==================
const app = express();
app.use(express.static('public'));
app.get('/Dashboard', function(req, res) {
    res.sendFile(path.join(__dirname , '/public/dashboard/dash.html'));
});
const http_server = http.createServer(app).listen(PORT, function() {
    console.log(`HTTP Server listening on port  ${ PORT }`);
})