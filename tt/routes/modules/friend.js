var crypto 		= require('crypto');
var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
var moment 		= require('moment');
var ObjectID = require('mongodb').ObjectID;
var dbPort 		= 27017;
var dbHost 		= 'localhost';
var dbName 		= 'loginsystem';

var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
	db.open(function(e, d){
	if (e) {
		console.log(e);
	}	else{
		console.log('connected to database :: ' + dbName);
	}
});

var friend = db.collection('friend');

exports.listFriend = function(email,callback){
	friend.findOne({email:email},function(e, o) {
		if (o){
			callback(null,o);
		}	else{
			callback('invalid-password');
		}
	});
}

exports.addNewFriend = function(email,emailfriend, callback)
{
	friend.findOne({email:email},function(e, o) {
		if (o){
			friend.update({email:email}, {$push:{friend:emailfriend}}, function(e, k){
				if(k != null){
					callback(null,k);
				}
				else{
					callback('add friend fail');
					}
			});
		}
		else{
			friend.insert({email:email,friend:[emailfriend], block:[]},function(e, t){
				if(t != null){
					callback(null,t);
				}
				else{
					callback('add friend fail');
				}
			})
		}
		});


}

exports.deleteFriend = function(email,emailfriend, callback)
{
	friend.update({email:email}, {$pop:{friend:emailfriend}},function(e, t){
		if(t != null){
			callback(null,t);
		}
		else{
			callback('add friend fail');
		}
	});
}
	exports.addBlock = function(email,emailblock, callback)
	{
		friend.findOne({email:email},function(e, o) {
			if (o){
				friend.update({email:email}, {$push:{block:emailblock}}, function(e, k){
					if(k != null){
						callback(null,k);
					}
					else{
						callback('add block friend fail');
						}
				});
			}
			else{
				friend.insert({email:email,friend:[], block:[emailblock]},function(e, t){
					if(t != null){
						callback(null,t);
					}
					else{
						callback('add  block friend fail');
					}
				})
			}
			});
		}
		exports.deleteBlock = function(email,emailblock, callback)
		{
			friend.update({email:email}, {$pop:{block:emailblock}},function(e, t){
				if(t != null){
					callback(null,t);
				}
				else{
					callback('unblock friend fail');
				}
			});
		}
