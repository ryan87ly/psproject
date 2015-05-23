var assert = require('assert');

var Achievement = require('../app/achievement/achievement.js');



describe("Achievement", function(){
	it('shold return false when achievement not completed', function(){
		var fakeAchievementConfig = {
			"requiredTimes" : 2
		}

		var fakeUserAchievementInfo = {
			"status": "init",
			"progress": 0
		}
		var achievement = new Achievement(fakeAchievementConfig, fakeUserAchievementInfo);
		var result = achievement.increaseActionCount();
		assert.equal(result, false);
	});

	it('shold return true when achievement completed', function(){
		var fakeAchievementConfig = {
			"requiredTimes" : 2
		}

		var fakeUserAchievementInfo = {
			"status": "init",
			"progress": 1
		}
		var achievement = new Achievement(fakeAchievementConfig, fakeUserAchievementInfo);
		var result = achievement.increaseActionCount();
		assert.equal(result, true);
	});
});