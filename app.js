const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get('/add-greeting', (req, res, next) => {
	res.send('<form action="/greeting" method="post"><input type="text" name="title"><button type="submit">Add Greeting</button></form>');
});

app.post('/greeting', (req, res, next) => {
	console.log(req.body);
	res.redirect('/');
});

app.get('/', (req, res, next) => {
	res.send('<h1>Welcome!</h1>');
});

app.listen(3000);
