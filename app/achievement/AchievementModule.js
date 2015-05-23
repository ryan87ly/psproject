var Achievement = require('../achievement/achievement.js');
var util = require('../lib/util.js');
var acievementConfig = util.getConfig('../../config/achievements.json');


var AchievementModule = function(options){
	var self = this;
	self.config = options || acievementConfig;
}

AchievementModule.prototype.onStart = function(app){
	var self = this;
	var achievements = self.config.achievements;
	var achievementsMap = {};

	achievements.forEach(function(achievement) {
		if(typeof achievementsMap[achievement.requiredAction] == 'undefined'){
			var achievementArray = [achievement];
			achievementsMap[achievement.requiredAction] = achievementArray;
		} else {
			achievementsMap[achievement.requiredAction].push(achievement);
		}
	});

	console.log(achievementsMap);

	self.achievementsMap = achievementsMap;

	app.on("playerAction", function(userId, action){
		console.log("get event " + userId + " " + action);
		var actionRelatedAchievements = self.achievementsMap[action];	
		if(typeof actionRelatedAchievements != 'undefined') {
			actionRelatedAchievements.forEach(function(achievementConfig){
				console.log("aconfig " + achievementConfig);
				userAchievementDao.queryUserAchievementInfo(userId, achievementConfig.id, function(err, userAchievementInfo){
					if(!err) {
						if(userAchievementInfo.status !== 'completed') {
							var achievement = new Achievement(achievementConfig, userAchievementInfo);
							var achievementCompleted = achievement.increaseActionCount();
							var updatedStatus = userAchievementInfo.status;
							if(achievementCompleted) {
								updatedStatus = "completed";
							}
							var updatedProgress = achievement.currentProgress();
							userAchievementDao.upsertUserAchievementInfo(userId, achievementConfig.id, updatedProgress, updatedStatus, function(err, r){

							});
						}
					}
				});
			});
		}
	});
}

module.exports = function(options) {
	return new AchievementModule(options);
}