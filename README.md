# Dailier
Solution for all your Daily Scrum Meeting issues! Fully automated and intelligent. Uses latest AI technologies to provide you with the best daily experience.

CodeCamp2019™️  project. 

# The server
Found under `/server` is a node REST service. Start with `node index.js`

Available endpoints:

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
	"data": "Mikko James Kai"
}'
```

## Get participants
```
curl -X GET \
  https://dailier.herokuapp.com/participants \
  -H 'Content-Type: application/json'
```
 
## Send yesterdays report for partipant
```
curl -X POST \
  http://localhost:3000/participants/Mikko/report/yesterday \
  -H 'Content-Type: application/json' \
  -d '{
	"data": "Lots of hacking"
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

## Get github issues
```
curl -X GET \
  https://dailier.herokuapp.com/github-issues \
    -H 'Content-Type: application/json'
```



# The admin interface
For debugging and administration there is a web interface for the system availabla at:
https://quirky-meitner-255d4f.netlify.com/

