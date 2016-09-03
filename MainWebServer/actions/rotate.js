var AWS = require("aws-sdk");
var INDEX_TEMPLATE = "sent.ejs";

AWS.config.loadFromPath('./config.json');

var sqs = new AWS.SQS();

exports.action = function (request, callback) {
	var files = JSON.parse(request.body.files);
	var angle = parseInt(request.body.angle);
	
	for (var i = 0; i < files.length; i++) {
		
		var params = {
			MessageBody: JSON.stringify({ file: files[i], angle: angle }),
			QueueUrl: 'https://sqs.us-west-2.amazonaws.com/983680736795/StepniewskiSQS'
		};
		
		sqs.sendMessage(params, function (err, data) {
			if (err) {
				console.log(err, err.stack);
			} 
			else {
				console.log(i);
				callback(null, { template: INDEX_TEMPLATE, params: { fields: null, bucket: null } });
			}
		});
	};

}
