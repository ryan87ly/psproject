

UserAchievementDao.prototype.queryUserAchievementInfo = function(userId, achievementId, callback) {
	self.collection.findOne({userId:userId, achievementId: achievementId}, function(err, result) {
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

UserAchievementDao.prototype.upsertUserAchievementInfo = function(userId, achievementId, progress, status, callback) {
	self.collection.update({userId: userId, achievementId: achievementId}, {$set:{progress:progress, status: status}}, {upsert:true}, function(err, result){
		if(err) {
			console.log("upsert user achievement error " + err);
			callback(err, null);
			return;
		}
		callback(null);
	});
}

UserAchievementDao.prototype.queryAllUserAchievements = function(userId, callback) {
	self.collection.find({userId:userId}).toArray(function(err, docs)) {
		if(err) {
			console.log("Query all user achievement error " + err);
			callback(err, null);
			return;
		}
		callback(docs);
	}
}