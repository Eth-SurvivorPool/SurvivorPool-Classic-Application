let express = require('express');
let path = require('path');
let app = express();

app.use('/', express.static(__dirname +  '/public'));

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

let hostname = 'localhost';
let port = process.env.VCAP_APP_PORT || 3000;

app.set('port', (process.env.PORT || 5000));

let server = app.listen(port, hostname, function() {
	console.log(`Server running at http://${hostname}:${port}/`);
});
