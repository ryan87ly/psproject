var assert = require('assert');
var opt = {'username': 'ryantest',
	'password': '123456789',
	'url': 'ds061711.mongolab.com:61711',
	'db': 'ryantest'
}

var databaseModule = require('../app/module/databaseModule.js')(opt);

describe("DatabaseModule", function(){
	this.timeout(10000);

	it('should connect sussfully', function(done){
		var fakeApplication = {};
		databaseModule.beforeStart(fakeApplication, function(err){
			assert.equal(err, null);
			done();
		});
	});
});