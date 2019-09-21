var actions = require("./actions");

var express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors')

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

var participants = [];

/**
 * Will be initialized with entry for each of the participant
 * Report type has fields:
 * - participant: Person's name
 * - yesterday: What did you do yesterday
 * - today: What you gonna do today
 * - blockers: Any blockers
 */
var dailyReports = [];

const intro = 'Good day. My name is Lucy and I will be guiding you through your daily standup. Who is present?';

app.post("/actions", (req, res, next) => {
	const command = req.body;
	console.log("Received request: " + JSON.stringify(req.body));

	if(command.action === 'start') {
		participants = [];
		dailyReports = [];
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


app.get("/daily", (req, res, next) => {
	res.json({report: dailyReports});
});

app.post("/participants", (req, res, next) => { 
	const command = req.body;
	const combined = participants.concat(command.data.split(" "));
	participants = Array.from(new Set(combined));
	dailyReports = initializeReport(participants);
	respondActions(res, actions.dailyReportAction(dailyReports));
});

app.get("/participants", (req, res, next) => {
	res.json({
		participants: participants
	});
});

app.post("/participants/:name/report/yesterday", (req, res, next) => {
	const participant = req.params.name;
	const command = req.body;

	var report = dailyReports.find(it => it.participant === participant)
	if(!report) {
		report = emptyReport(participant);
		dailyReports.push(report);
	}

	report.yesterday = command.data;
	respondActions(res, actions.ackAction());
});

app.listen(port, () => {
 console.log("Server running on port " + port);
});

function respondActions(res, actions) {
	res.json({
		actions: actions
	});
}

function initializeReport(participants) {
	const report = [];
	participants.forEach(it => report.push(emptyReport(it)));
	return report;
}

function emptyReport(name) {
	return {
		participant: name,
		yesterday: null,
		today: null,
		blockers: null
	};
}



