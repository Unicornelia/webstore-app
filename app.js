const http = require('http');

const server = http.createServer((req, res) => {
	console.log(req.url, req.method, req.headers);

	res.setHeader('Content-Type', 'text/html');

	res.write('<!DOCTYPE html>');
	res.write('<html lang="en">');
	res.write('<head><title>Node server based Html</title></head>');
	res.write('<body><h2>Greetings from Node.js server!</h2></body>');
	res.write('</html>');
	res.end();
});

server.listen(3000);
