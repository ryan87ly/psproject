var application = require("./app/application.js");
var express = require('express');
var app = express();

application.start(function(err){
	if(!err) {
		//Handle playerAction
		app.get("/playerAction", function(req, res){
			var userId = parseInt(req.query.userId);
			var action = req.query.action;
			if(!userId || !action) {
				res.status(400).send("Invalid query string")
			} else {
				application.emit("playerAction", userId, action);
				res.send("Command success");
			}
		});

		//Handle queryUserAchievements
		app.get("/queryUserAchievements", function(req, res){
			var userId = parseInt(req.query.userId);
			if(!userId){
				res.status(400).send("Invalid query string")
			} else {
				application.getModule("achievementModule").queryAllUserAchievements(userId, function(err, docs){
					if(!err){
						res.send(docs);
					} else {
						res.status(400).send("Bad Request")
					}
				})
			}
		})
		var server = app.listen(8090, function(){
			var host = server.address().address;
			var port = server.address().port;
			console.log("server have listened to http://%s:%s", host, port);
		});
	}
});