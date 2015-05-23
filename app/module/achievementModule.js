var Achievement = require('../achievement/achievement.js');
var util = require('../lib/util.js');
var acievementConfig = util.getConfig('../../config/achievements.json');
var async = require('async');

var config = {}
var application;
var achievementsMap = {};

var AchievementModule = function(options){
	var self = this;

	//Read achievements config from config file or from creator
	config = options || acievementConfig;
}

/**
 * Module beforeStart hook
 * @param {Application} app, the main application object
 * @param {Function(Error)} callback, callback when all before start operation sucess
 */

AchievementModule.prototype.beforeStart = function(app, callback){
	application = app;
	var achievements = config.achievements;
	achievementsMap = {};

	//Store all achievements to a map, key by achievement required achievement action
	achievements.forEach(function(achievement) {
		if(typeof achievementsMap[achievement.requiredAction] == 'undefined'){
			var achievementArray = [achievement];
			achievementsMap[achievement.requiredAction] = achievementArray;
		} else {
			achievementsMap[achievement.requiredAction].push(achievement);
		}
	});
	callback();
}

var userAchievementDao;
var rewardModule;

/**
 * Module onStart hook
 */

AchievementModule.prototype.onStart = function() {
	var self = this;
	userAchievementDao = application.getModule("databaseModule").getDao("userAchievementDao");
	rewardModule = application.getModule("rewardModule");

	//Listen on playerAction event
	application.on("playerAction", function(userId, action){

		//Get related achievement config
		var actionRelatedAchievements = achievementsMap[action];
		if(typeof actionRelatedAchievements != 'undefined') {

			//Loop all related achievement config
			actionRelatedAchievements.forEach(function(achievementConfig){

				//Query user current achievement info by achievementId
				userAchievementDao.queryUserAchievementInfo(userId, achievementConfig.id, function(err, userAchievementInfo){
					if(!err) {
						//If use current achievement not completed, handle progress
						if(userAchievementInfo.status !== 'completed') {
							var achievement = new Achievement(achievementConfig, userAchievementInfo);
							var achievementCompleted = achievement.increaseActionCount();
							var updatedProgress = achievement.currentProgress();
							var updatedStatus = achievement.currentStatus();

							//Update user achievement progress
							userAchievementDao.upsertUserAchievementInfo(userId, achievementConfig.id, updatedProgress, updatedStatus, function(err, r){});
							if(achievementCompleted) {
								//If achievement completed, dispatch rewards to user
								var rewards = achievementConfig.rewards;
								rewardModule.dispathRewards(rewards, userId);
							}
						}
					} else {
						console.log("err " + err);
					}
				});
			});
		}
	});
}

/**
 * Query all user achievements info
 * @param {Integer} userId
 * @param {Function(Error, Array)} callback, callback when all user achiements info
 */

AchievementModule.prototype.queryAllUserAchievements = function(userId, callback) {
	async.map(config.achievements, function(achievementConfig, cb){
		userAchievementDao.queryUserAchievementInfo(userId, achievementConfig.id, cb);
	}, callback);
}

module.exports = function(options) {
	return new AchievementModule(options);
}