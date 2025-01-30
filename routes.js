const fs = require('fs');

const requestHandler = (req, res) => {
	const url = req.url;
	const method = req.method;

	if (url === '/') {
		res.write('<!DOCTYPE html>');
		res.write('<html lang="en">');
		res.write('<head><title>Hello!</title></head>');
		res.write('<body>' +
			'<h2>Greetings!</h2>' +
			'<p>If you would like to create a new user, please use the form</p>' +
			'<form action="/create-user" method="POST">' +
			'<input type="text" name="users"><button type="submit">Add User</button>' +
			'</form>' +
			'</body>');
		res.write('</html>');
		return res.end();
	} else if (url === '/users') {
		res.write('<!DOCTYPE html>');
		res.write('<html lang="en">');
		res.write('<head><title>List of users</title></head>');
		res.write('<body>' +
			'<h2>Our existing users</h2>' +
			'<ul><li>Jane</li><li>Mary</li><li>Lisa</li></ul>' +
			'</body>');
		res.write('</html>');
		return res.end();
	} else if (url === '/create-user' && method === 'POST') {
		const body = [];
		req.on('data', (chunk) => {
			body.push(chunk);
		});
		return req.on('end', () => {
			const parsedBody = Buffer.concat(body).toString('utf8');
			const user = parsedBody.split('=')[1];
			console.log(user);
			fs.writeFile('user.text', user, (err) => {
				res.statusCode = 302;
				res.setHeader('Location', '/users');
				return res.end();
			});
		});
	}
}

module.exports = requestHandler;