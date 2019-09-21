var actions = require("./actions");

var express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

const Octokit = require("@octokit/rest");

var recording = [];
var participants = [];

const intro =
	"Good day. My name is Lucy and I will be guiding you through your daily stand up. Who is present?";

/**
 * Will be initialized with entry for each of the participant
 * Report type has fields:
 * - participant: Person's name
 * - yesterday: What did you do yesterday
 * - today: What you gonna do today
 * - blockers: Any blockers
 */
var dailyReports = [];

var dailyStarted;
var dailyEnded;

app.post("/actions", (req, res, next) => {
	const command = req.body;
	console.log("Received request: " + JSON.stringify(req.body));

	if (command.action === "start") {
		recording = [];
		participants = [];
		dailyReports = [];
		dailyStarted = new Date();
		respondActions(res, [
			actions.sayAction(intro),
			actions.recordAction("/participants")
		]);
	}

	if (command.action === "dictate") {
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

app.get("/daily", (req, res, next) => {
	res.json({
		dailyStarted: dailyStarted,
		dailyEnded: dailyEnded,
		report: dailyReports
	});
});

app.get("/github-issues", (req, res, next) => {
});

app.get("/whosturnisit", (req,res,next) => {
	for (let i = 0; i < dailyReports.length; i++) {
		const report = dailyReports[i];
		if (!report.yesterday.text || !report.today.text || !report.blockers.text) {
			res.json({
				currentPerson: report.participant
			});
			return;
		}
	}

	res.json({currentPerson: null});
});

app.post("/participants", (req, res, next) => {
	const command = req.body;
	const newParticipants = command.data.text.trim()
		.split(" ")
		.filter(it => it.trim().length != 0)
	const combined = participants.concat(newParticipants);
	participants = Array.from(new Set(combined));

	if (participants.length === 0) {
		respondActions(res,
			[
				actions.sayAction("Could not hear any participants, can you repeat please?"),
				actions.recordAction("/participants")
			])
		return;
	}

	dailyReports = initializeReport(participants);
	respondActions(res, actions.dailyReportAction(dailyReports));
});

app.get("/participants", (req, res, next) => {
	res.json({
		participants: participants
	});
});


app.post("/participants/:name/report/:topic", (req, res, next) => {
	const participant = req.params.name;
	const topic = req.params.topic;
	const command = req.body;

	var report = dailyReports.find(it => it.participant === participant);
	if (!report) {
		report = emptyReport(participant);
		dailyReports.push(report);
	}

	const insertIssueLink = (inputString, issue) => {
		const textLoc = inputString.search(issue.number.toString())
		const textLocEnd = textLoc + issue.number.toString().length
		const before = inputString.slice(0, textLoc)
		const after = inputString.slice(textLocEnd, inputString.length)
		return `${before}<strong><a href="${issue.html_url}" target="_blank">#${issue.number.toString()}</a> ( ${issue.title} ) </strong>${after}`
	}

	report[topic] = command.data
	
	const octokit = new Octokit();
	
	octokit.issues
	.listForRepo({ owner: "MRavimoF", repo: "dailier" })
	.then(({ data }) => {
		const getNumbers = (inputString) => inputString.match(/\d+/g).map(Number)
		const numbers = getNumbers(command.data.text)
		const issues = data.map(i => ({ number: i.number, title: i.title, html_url: i.html_url })).filter(i => numbers.includes(i.number))
		let tempStr = report[topic].text;
		issues.forEach(i => {
			tempStr = insertIssueLink(tempStr, i)
		})
		report[topic].text = tempStr || command.data.text
	}).catch(e => {
		console.log('error contacting github')
		console.log(e)
	})

	const nextActions = actions.dailyReportAction(dailyReports);
	if(nextActions)
		respondActions(res, nextActions);
	else {
		// All good. Everyone accounted for.
		dailyEnded = new Date();
		respondActions(res, [actions.sayAction("Good job team! Keep up the good work and EBIT flowing. Let's do this again tomorrow. Make dailies great again. Go tell your friends.")]);
	}
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
		yesterday: emptyTopic(),
		today: emptyTopic(),
		blockers: emptyTopic()
	};
}

function emptyTopic() {
	return {
		text: null,
		startAt: null,
		endAt: null
	};
}
