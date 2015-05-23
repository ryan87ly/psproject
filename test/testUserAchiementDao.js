var assert = require('assert');
var mongoClient = require('mongodb').MongoClient

var path = 'mongodb://ryantest:123456789@ds061711.mongolab.com:61711/ryantest';
var collection;

var achievementDao;


describe("UserAchiementDao", function(){
	this.timeout(10000);

	before(function(done) {
		mongoClient.connect(path, function(err, db){
			collection = db.collection("mochatest");
			collection.drop(function(e, r){
				achievementDao = require('../app/dao/userAchievementDao.js')(collection);
				done();
			});
		});
	});

	it('should successfully upsert new record', function(done){
		achievementDao.upsertUserAchievementInfo(1, 1, 2, "init", function(err){
			assert.equal(err, null);
			done();
		});
	})

	it('should successfully query a record just inserted', function(done){
		achievementDao.queryUserAchievementInfo(1, 1, function(err, doc){
			assert.equal(err, null);
			assert.equal(doc.progress, 2);
			assert.equal(doc.status, 'init');
			done();
		});
	})

	after(function(done) {
		collection.drop(function(e, r){
			done();
		})
	})
})