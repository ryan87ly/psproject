# psproject
Using [mocha](http://mochajs.org/) framework

```
> mocha
```

## How To Run
1. install all the dependencies `> npm install `
2. run the application `> node app.js `

## Fold Structure

```
 |-- app
 |   |-- dao //Dao folder
 |   |-- lib //Some utility lib 
 |   |-- module //Module foler
 |   |-- application.js //Application
 |-- config
 |        |-- mongoConfig.json //Mongodb config
 |        |-- achievements.json //Achievements config
 |-- test //All tests
 |-- app.js //Main file for the application
```

## Configuration
Fill mongodb setting in config/mongo_config.json using valid json format. 
```
{
	"username": "yourusername",
	"password": "yourpassword",
	"url": "db_url",
	"db": "db_name",
}
```
Modify achievement config in config/achiements.json using valid json format, a single achievement config should be like
```
{
	"id" : 1, //achievement id
	"requiredAction" : "spin", //action the achievement will response 
	"requiredTimes" : 2, //how many times the player action should  be done before complete the achievement
	"rewards": [  //list for achievement rewards
		{
			"coin": 10
		}
	]
}, 
```

## How to trigger player action
###By calling code
```
application.emit("playerAction", userId, action);
```
###By http request
This app default creates a http server at localhost:8090. There are two routes setting at server for debug the whole logic.
You can trigger a playerAction event by request

http://localhost:8090/playerAction?userId=[**YOURUSERID**]&action=[**YOURACTION**]

You can query user's achievement info by request 

http://localhost:8090/queryUserAchievements?userId=[**YOURUSERID**]
