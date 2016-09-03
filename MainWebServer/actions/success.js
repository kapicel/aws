var AWS = require("aws-sdk");
var INDEX_TEMPLATE = "success.ejs";
var simpleDb = require("./simpleDb");
AWS.config.loadFromPath('./config.json');

var task = function (request, callback) {
	var fileParams = {
		bucket: request.query.bucket,
		key: request.query.key
	};
	
	var AttributesPut = [];
	
	AttributesPut.push({
		Name: 'name', 
		Value: fileParams.key
	});
	
	
	simpleDb.putAttributes(fileParams.key, AttributesPut, function () {
		simpleDb.getFromDb(fileParams.key);
	});
	
	callback(null, {
		template: INDEX_TEMPLATE, params: {
			fileName: fileParams.key
		}
	});
}

exports.action = task;