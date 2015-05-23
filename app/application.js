var events = require('events');
var fs = require('fs');
var path = require('path');
var async = require('async');

var modules = {};

function Application() {
	events.EventEmitter.call(this);
}

Application.prototype.__proto__ = events.EventEmitter.prototype;


/**
 * Start the application, initialize all module 
 * @param {Function(Error)} callback indicate whether application start success
 */
Application.prototype.start = function(callback){
	var self = this;

	var moduleList = [];

	//Register all module under app/module directory
	fs.readdirSync(__dirname + '/module').forEach(function (filename) {
		var name = path.basename(filename, '.js');
		var module = require('./module/' + filename)();
		modules[name] = module;
		moduleList.push(module);
	});
	console.log("before starting module");

	//Call beforeStart on every module
	async.applyEach(moduleList.map(function(module){
		return 	module.beforeStart;
	}), self, function(err){
		if(err){
			console.log("start module error " + err);
			callback(err);
		} else {
			console.log("all module beforeStart complete ");

			//Call onStart on every module
			moduleList.forEach(function(module){
				module.onStart();
			});
			callback();
		}
	});
}


Application.prototype.getModule = function(moduleName){
	return modules[moduleName];
}

module.exports = new Application();