var express = require("express");
const bodyParser = require('body-parser');
	
var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post("/actions", (req, res, next) => {
	console.log("Received request: " + JSON.stringify(req.body));
	res.json(respond('Good day. My name is Lucy and I will be guiding you through your daily standup.'));
});

app.listen(port, () => {
 console.log("Server running on port " + port);
});


function respond(message) {
	return {
		message: message
	}
};

