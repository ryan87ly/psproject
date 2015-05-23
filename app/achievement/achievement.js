var Achievement = function(achievementConfig, userAchievementInfo) {
	var self = this;
	self.achievementConfig = achievementConfig;
	self.userAchievementInfo = userAchievementInfo;
}

Achievement.prototype.increaseActionCount = function() {
	var updatedProgress = this.userAchievementInfo.progress + 1;
	this.userAchievementInfo.progress = updatedProgress;
	if(updatedProgress >= this.achievementConfig.requiredTimes) {
		this.userAchievementInfo.status = "completed";
		//achievement complete
		return true;
	} else {
		return false;
	}
}

Achievement.prototype.currentProgress = function(){
	return this.userAchievementInfo.progress;
}

Achievement.prototype.currentStatus = function(){
	return this.userAchievementInfo.status;
}


module.exports = Achievement;