var assert = require('assert');

describe("RewardModule", function(){
	this.timeout(10000);
	it('should start successfully', function(done){
		var fakeApplication = {};
		var rewardModule = require('../app/module/rewardModule.js')();
		rewardModule.beforeStart(fakeApplication, function(err){
			assert.equal(err, null);
			done();
		})
	});
});