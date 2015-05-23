var collection;

var UserAchievementDao = function(coll) {
	collection = coll;
}

/**
 * Query UserAchievementInfo, if not related record found, return default UserAchievementInfo with progress 0, status 'init'
 * @param {Integer} userId, userId to be queryed
 * @param {Integer} achievementId, achievementId to be queryed
 * @param {Function(MongoError, Object)} callback with UserAchievementInfo
 */
UserAchievementDao.prototype.queryUserAchievementInfo = function(userId, achievementId, callback) {
	collection.findOne({userId:userId, achievementId: achievementId}, function(err, result) {
		if(err) {
			console.log("query user achievementinfo error " + err);
			callback(err, null);
			return;
		}
		if(result) {
			callback(null, result);
		} else {
			var defaultValue = {userId:userId, achievementId: achievementId, progress:0, status: "init"};
			callback(null, defaultValue);
		}
	});
}

/**
 * Update or insert UserAchievementInfo
 * @param {Integer} userId, userId to be upsert
 * @param {Integer} achievementId, achievementId to be upsert
 * @param {Integer} progress, updated progress
 * @param {String} status, updated status
 * @param {Function(MongoError)} callback indicated operation success or not
 */

UserAchievementDao.prototype.upsertUserAchievementInfo = function(userId, achievementId, progress, status, callback) {
	collection.update({userId: userId, achievementId: achievementId}, {$set:{progress:progress, status: status}}, {upsert:true}, function(err, result){
		if(err) {
			console.log("upsert user achievement error " + err);
			callback(err);
			return;
		}
		callback(null);
	});
}

module.exports = function(collection) {
	return new UserAchievementDao(collection);
}