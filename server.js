let express = require('express');
let path = require('path');
let app = express();

app.use(express.static(__dirname +  '/public'));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

let hostname = 'localhost';
let port = process.env.PORT || 3000;

let server = app.listen(port, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});

console.log(server);
