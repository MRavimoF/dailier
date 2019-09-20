var express = require("express");
const bodyParser = require('body-parser');
	
var app = express();

app.use(bodyParser.json());

app.post("/actions", (req, res, next) => {
	console.log("Received request: " + JSON.stringify(req.body));
	res.json(respond('Good day. My name is Lucy and I will be guiding you through your daily standup.'));
});

app.listen(3000, () => {
 console.log("Server running on port 3000");
});


function respond(message) {
	return {
		message: message
	}
};

