var express = require("express");
const bodyParser = require('body-parser');
cors = require('cors')

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

var recording = [];
var participants = [];

const intro = 'Good day. My name is Lucy and I will be guiding you through your daily standup. Who is present?';

app.post("/actions", (req, res, next) => {
	const command = req.body;
	console.log("Received request: " + JSON.stringify(req.body));

	if(command.action === 'start') {
		respondActions(res, [
			sayAction(intro),
			recordAction("participants")
		]);
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

app.post("/participants", (req, res, next) => { 
	const command = req.body;

	const combined = participants.concat(command.payload.split(" "));
	participants = Array.from(new Set(combined));
	res.json(ackResponse());
});

app.get("/participants", (req, res, next) => {
	res.json({
		participants: participants
	});
});

app.listen(port, () => {
 console.log("Server running on port " + port);
});

function respondActions(res, actions) {
	res.json({
		actions: actions
	});
}

function sayAction(message) {
	return action("SAY", message);
}

function recordAction(recordType) {
	return action("RECORD", recordType);
}

function action(type, payload) {
	return {
		type: type,
		payload: payload
	};
}

function ackResponse() {
	return {
		action: "ACK",
		payload: "received command"
	}
}

function respond(message) {
	return {
		action: "SAY",
		payload: message
	}
};

