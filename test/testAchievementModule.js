var assert = require('assert');
var sinon = require('sinon');

var config = {
	"achievements": [
		{
			"id" : 1,
			"requiredAction" : "roll",
			"requiredTimes" : 1,
			"rewards": [ 
				{
					"coin": 20
				}
			]
		}, 
		{
			"id" : 2,
			"requiredAction" : "spin",
			"requiredTimes" : 2,
			"rewards": [
				{
					"coin": 20
				}
			]
		}
	]
}

var achievementModule = require('../app/module/achievementModule.js')(config);

var mockUserAchievementDao = {
	queryUserAchievementInfo: function(userId, achievementId, callback){
		if(achievementId == 1) {
			callback(null, {status:"init", achievementId:1, progress:0})
		} else if(achievementId == 2) {
			callback(null, {status:"init", achievementId:2, progress:0})
		}
	},

	upsertUserAchievementInfo: function(userId, achievementConfigId, updatedProgress, updatedStatus, callback) {
		callback();
	},

	queryAllUserAchievements: function(userId, callback) {
		var achievements = [
			{status:"init", achievementId:1, progress:0},
			{status:"init", achievementId:2, progress:0}
		];
		callback(null, achievements);
	}
}

var mockDatabaseModule = {
	getDao: function(daoName){
		return mockUserAchievementDao;
	}
}

var mockRewardModule = {
	dispathRewards: function(rewards, userId){

	}
}

var events = require('events');
var emitter = new events.EventEmitter();
var userId = 10;

var mockApplication = {
	getModule: function(moduleName) {
		if(moduleName == "databaseModule"){
			return mockDatabaseModule;
		}
		else if(moduleName == "rewardModule"){
			return mockRewardModule;
		}
	},
	on: function(event, callback) {
		emitter.on(event, callback)
	}
}

describe("AchievementModule", function(){
	this.timeout(10000);

	it('should start successfully', function(done){
		achievementModule.beforeStart(mockApplication, function(err){
			assert.equal(err, null);
			achievementModule.onStart();
			done();
		});
	});

	var queryUserAchievementInfo_spy = sinon.spy(mockUserAchievementDao, 'queryUserAchievementInfo');
	var dispathRewards_spy = sinon.spy(mockRewardModule, 'dispathRewards');
	var upsertUserAchievementInfo_spy = sinon.spy(mockUserAchievementDao, 'upsertUserAchievementInfo');

	function clear(){ 
		queryUserAchievementInfo_spy.reset();
		dispathRewards_spy.reset();
		upsertUserAchievementInfo_spy.reset();		
	}

	it('should dispath reward when achievement fullfill requirement', function(done){
		clear();
		emitter.emit("playerAction", userId, "roll");
		setTimeout(function(){
			assert.equal(queryUserAchievementInfo_spy.callCount, 1);
			assert.equal(dispathRewards_spy.callCount, 1);
			assert.equal(upsertUserAchievementInfo_spy.callCount, 1);
			done();
		}, 2000);
	})

	it('should not dispath reward when achievement requirement not fullfilled', function(done){
		clear();
		emitter.emit("playerAction", userId, "spin");
		setTimeout(function(){
			assert.equal(queryUserAchievementInfo_spy.callCount, 1);
			assert.equal(dispathRewards_spy.callCount, 0);
			assert.equal(upsertUserAchievementInfo_spy.callCount, 1);
			done();
		}, 2000);
	})
	it('should return two elements array when query all user achievemrnt', function(done){
		achievementModule.queryAllUserAchievements(userId, function(err, docs){
			assert.equal(err, null);
			assert.equal(docs.length, 2);
			done();
		})
	})
});