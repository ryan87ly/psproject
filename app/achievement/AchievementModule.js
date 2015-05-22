var Achievement = require('../achievement.js');
var util = require('../lib/util.js');
var acievementConfig = util.getConfig('/config/achievements.json');


var AchievementModule = function(options){
	self.config = options || acievementConfig;
}

AchievementModule.prototype.onStart = function(){
	var achievements = self.config.achievements;
	var achievementsMap = {};

	achievements.forEach(function(achivement) {
		if(typeof achievementsMap[achievement.requiredAction] == 'undefined'){
			var achievementArray = [achievement];
			achievementsMap[achievement.requiredAction] = achievementArray;
		} else {
			achievementsMap[achievement.requiredAction].push(achievement);
		}
	});
}

AchievementModule.prototype.onPlayAction = function(userId, action) {
	var actionRelatedAchievements = achievementsMap[action];	
	if(typeof actionRelatedAchievements != 'undefined') {
		actionRelatedAchievements.forEach(function(achievementConfig){
			userAchievementDao.queryUserAchievementInfo(userId, achievementConfig.id, function(err, userAchievementInfo){
				if(!err) {
					if(userAchievementInfo.status !== 'completed') {
						var achivement = new Achievement(achievementConfig, userAchievementInfo);
						var achievementCompleted = achivement.increaseActionCount();
						var updatedStatus = userAchievementInfo.status;
						if(achievementCompleted) {
							updatedStatus = "completed";
						}
						var updatedProgress = achivement.currentProgress();
						userAchievementDao.upsertUserAchievementInfo(userId, achievementConfig.id, updatedProgress, updatedStatus, function(err, r){

						});
					}
				}
			});
		});
	}
}



module.exports = function(options) {
	return new AchievementModule();
}