var actions = require("./actions");

var express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors')

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
			actions.sayAction(intro),
			actions.recordAction("participants")
		]);
	}

	if(command.action === 'dictate') {
		recording.push(command.payload);
		res.json(actions.ackAction());
	}

});


app.get("/transcript", (req, res, next) => {
	const sentences = recording;
	res.json({
		sentences: sentences
	});
});

app.post("/participants", (req, res, next) => { 
	const command = req.body;
	const combined = participants.concat(command.data.split(" "));
	participants = Array.from(new Set(combined));
	res.json(actions.ackAction());
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



