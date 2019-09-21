# Dailier
Solution for all your Daily Scrum Meeting issues! Fully automated and intelligent. Uses latest AI technologies to provide you with the best daily experience.

CodeCamp2019™️  project. 

# The server
Found under `/server` is a node REST service. Start with `node index.js`

# API Docs

See additional generated docs at http://localhost:3000/docs or https://dailier.herokuapp.com/docs

# Available endpoints:

## Start the daily
Request:
```
curl -X POST \
  https://dailier.herokuapp.com/actions \
  -H 'Content-Type: application/json' \
  -d '{
	"action": "start"
}'
```

The response:
```
{
    "actions": [
        {
            "type": "SAY",
            "callback": null,
            "data": "Good day. My name is Lucy and I will be guiding you through your daily standup. Who is present?"
        },
        {
            "type": "RECORD",
            "callback": "participants",
            "data": null
        }
    ]
}```
So this should be interpreted as follows on DailyBox:
1. Say the message
2. Start recording
3. Send recorded text to endpoint `POST /participants` (determined by the original response)

## Get the daily
```
curl -X GET \
  https://dailier.herokuapp.com/daily \
  -H 'Content-Type: application/json'
```

Response:
```
{
    "report": [
        {
            "participant": "Mikko",
            "yesterday": "Lots of hacking",
            "today": null,
            "blockers": null
        }
    ]
}
```

## Add participants
```
curl -X POST \
  https://dailier.herokuapp.com/participants \
  -H 'Content-Type: application/json' \
  -d '{
	"data": {
    "text": "Mikko James Kai"
  }
}'
```

## Get participants
```
curl -X GET \
  https://dailier.herokuapp.com/participants \
  -H 'Content-Type: application/json'
```
 
## Send yesterdays report for participant
```
curl -X POST \
  https://dailier.herokuapp.com/participants/Mikko/report/yesterday \
  -H 'Content-Type: application/json' \
  -d '{
	"data": "Lots of hacking"
}'
```

## Send yesterdays report for participant with github issue
```
curl -X POST \
  https://dailier.herokuapp.com/participants/James/report/yesterday \
  -H 'Content-Type: application/json' \
  -d '{
	"data": "I am almost done with issue number 10 and I just have to finish up a few things after the daily."
}'
```

## Get whole transcript
```
curl -X GET \
  https://dailier.herokuapp.com/transcript \
    -H 'Content-Type: application/json' \
      -d '{
      	"action": "start"
	}'
```

# The admin interface
For debugging and administration there is a web interface for the system availabla at:
https://quirky-meitner-255d4f.netlify.com/

