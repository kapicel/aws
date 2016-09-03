var AWS = require("aws-sdk");
AWS.config.loadFromPath('./config.json');

var simpledb = new AWS.SimpleDB();
var domainName = 'tracz.lukasz';

var createDomain = function(callback){
var params = {
  DomainName: domainName /* required */
};
simpledb.createDomain(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else  
	{ 
	console.log('Utworzono SimpleDB Domain');           // successful response
    callback();
   }
});
}

var getFromDb = function(itemName){
var params = {
  DomainName: domainName, /* required */
  ItemName: itemName, /* required */
};
simpledb.getAttributes(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log('Wiadomosc z getAttributes ' + JSON.stringify(data));     // successful response
});
}

var putAttributes = function(itemName, attributes, callback)
{
var params = {
  Attributes: attributes,
  DomainName: domainName, /* required */
  ItemName: itemName, /* required */
};
simpledb.putAttributes(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     
  {
	console.log('Zapisano do SimpleDB');           // successful response
	callback();
  }
});
}

exports.getFromDb = getFromDb;
exports.createDomain = createDomain;
exports.putAttributes = putAttributes;