var util = require('../lib/util.js');
var acievementConfig = util.getConfig('/config/achievements.json');

var AchievementModule = function(options){
	self.config = options || acievementConfig;
}

AchievementModule.prototype.onStart() = function(){
	var achievements = self.config.achievements;
	var achievementsMap = {};

	for(i = 0; i < achievements.length; ++i) {
		var achievement = achievements[i];
		if(typeof achievementsMap[achievement.requiredAction] == 'undefined'){
			var achievementArray = [achievement];
			achievementsMap[achievement.requiredAction] = achievementArray;
		} else {
			achievementsMap[achievement.requiredAction].push(achievement);
		}
	}

}

module.exports = function(options) {
	return new AchievementModule();
}