var AWS = require("aws-sdk");
var simpleDb = require("./simpleDb");
AWS.config.loadFromPath('./config.json');
var INDEX_TEMPLATE = "gallery.ejs";

var s3 = new AWS.S3();

var bucketName = "stepniewski-lab4";

var params = {
	Bucket: bucketName
};

var task = function (request, callback) {
	
	s3.listObjects(params, function (err, data) {
		if (err) console.log(err, err.stack); // an error occurred
		else {
			data.Contents.shift();
			callback(null, {
				template: INDEX_TEMPLATE , params: {
					bucket: bucketName,
					files: data.Contents
				}
			});
		}
	});
}

exports.action = task;