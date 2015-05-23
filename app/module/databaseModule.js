var util = require('../lib/util.js');
var mongoConfig = util.getConfig('../../config/mongoConfig.json');
var mongoClient = require('mongodb').MongoClient
var fs = require('fs');
var path = require('path');

var daos = {};
var config = {};
var application;

var DatabaseModule = function(options) {
	var self = this;
	config = options || mongoConfig;
}

/**
 * Module beforeStart hook
 * @param {Application} app, the main application object
 * @param {Function(Error)} callback, callback when all before start operation sucess
 */
DatabaseModule.prototype.beforeStart = function(app, callback) {
	var self = this;
	application = app;

	//Read setting from config
	var dbUrl = 'mongodb://'
	if(typeof config.username !== 'undefined' && typeof config.password !== 'undefined')
		dbUrl = dbUrl + config.username + ':' + config.password + '@';
	dbUrl = dbUrl +  config.url + '/' + config.db;

	//Connect to mongodb
	mongoClient.connect(dbUrl, function(err, db){
		if(err) {
			console.log("connection error " + err);
			callback(err);
		} else {
			console.log("mongo connection success ");

			//Register all dao under app/dao directory
			fs.readdirSync(path.join(__dirname, '../dao')).forEach(function (filename) {
				var name = path.basename(filename, '.js');
				var collectionName = name.replace("Dao", "");
				var dao = require('../dao/' + filename)(db.collection(collectionName));
				daos[name] = dao;
			});
			callback();
		}
		
	});
}

/**
 * Module onStart hook
 */
DatabaseModule.prototype.onStart = function(){

}

/**
 * Get registered dao 
 * @param {String} daoName, 
 * @return {Object} dao object if given daoName has registered, otherwise return undefined
 */

DatabaseModule.prototype.getDao = function(daoName) {
	return daos[daoName];
}

module.exports = function (options) {
	return new DatabaseModule(options);
}

