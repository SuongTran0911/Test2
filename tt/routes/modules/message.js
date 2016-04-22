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

var message = db.collection('message');

exports.ReceiverlistMessage = function(email, callback)
{
	message.find({receiver:email}).sort({date: -1}).toArray(function(e, o) {
		if (o){
			callback(null,o);
		}	else{
			callback('not message');
		}
	});
}

exports.SenderlistMessage = function(email, callback)
{
	message.find({sender:email}).sort({date: -1}).toArray(function(e, o) {
		if (o){
			callback(null,o);
		}	else{
			callback('not message');
		}
	});
}

exports.Findmessage = function(id, callback)
{
	message.findOne({_id:ObjectID(id)}, function(e, o) {
		if (o){
			callback(null,o);
		}	else{
			callback('not message');
		}
	});
}
exports.updateMessage = function(id, callback)
{
	message.findOne({_id:ObjectID(id)}, function(e, o){
		o.read = true;
		o.readdate = moment().format('MMMM Do YYYY, h:mm:ss a');
			message.save(o, {safe: true}, function(e) {
				if (e) callback(e);
				else callback(null, o);
			});
	});
}
exports.addNewMessage = function(newData, callback)
{
		newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
		message.insert(newData, {safe: true}, callback);

}
