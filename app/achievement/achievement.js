
var Achievement = function(achievementConfig, userAchievementInfo) {
	self.achievementConfig = achievementConfig;
	self.userAchievementInfo = userAchievementInfo;
}

Achievement.prototype.increaseActionCount = function() {
	var updatedProgress = self.userAchievementInfo.progress + 1;
	self.userAchievementInfo.progress = updatedProgress;
	if(updatedProgress >= achievementConfig.requiredTimes) {
		//achievement complete
		return true;
	} else {
		return false;
	}
}

Achievement.prototype.currentProgress = function(){
	return self.userAchievementInfo.progress;
}


module.exports = Achievement;