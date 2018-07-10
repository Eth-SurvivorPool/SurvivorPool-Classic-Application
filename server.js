const express = require('express');
const app = express();
const path = require('path');

app.use('/', express.static(__dirname +  '/public'));

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

const hostname = 'localhost';
const port = process.env.VCAP_APP_PORT || 3000;


if (process.env.VCAP_APP_PORT != null) {
    app.listen(port, function () {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
}
else
{
    app.listen(port, hostname, function () {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
}
