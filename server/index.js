var express = require("express");
const bodyParser = require('body-parser');
	
var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());

var recording = [];

app.post("/actions", (req, res, next) => {
	const command = req.body;
	console.log("Received request: " + JSON.stringify(req.body));

	if(command.action === 'start') {
		res.json(respond('Good day. My name is Lucy and I will be guiding you through your daily standup. Who is present?'));
	}

	if(command.action === 'dictate') {
		recording.push(command.payload);
		res.json(ackResponse());
	}

	recording.forEach(it =>
		console.log(it)
	);

});

app.get("/transcript", (req, res, next) => {

	const sentences = recording;
	res.json({
		sentences: sentences
	});

});

app.listen(port, () => {
 console.log("Server running on port " + port);
});

function ackResponse() {
	return {
		action: "ACK",
		payload: "received text"
	}
}

function respond(message) {
	return {
		action: "SAY",
		payload: message
	}
};

