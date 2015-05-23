var application;

var RewardModule = function() {

}

/**
 * Module beforeStart hook
 * @param {Application} app, the main application object
 * @param {Function(Error)} callback, callback when all before start operation sucess
 */
RewardModule.prototype.beforeStart = function(app, callback) {
	application = app;
	callback();
}

/**
 * Module onStart hook
 */
RewardModule.prototype.onStart = function() {

}

/**
 * Dispatch rewards to user, currently this function is not implemented
 * @param {Array} rewards, the rewards to be dispatched
 * @param {Integer} userId
 */
RewardModule.prototype.dispathRewards = function(rewards, userId) {
	
}

module.exports = function(){
	return new RewardModule();
}