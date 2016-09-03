var AWS = require("aws-sdk");
AWS.config.loadFromPath('./config.json');
var lwip = require('lwip');
var s3 = new AWS.S3();
var sqs = new AWS.SQS();

function executeRotateJob(message) {
	
	var bodyMsg = JSON.parse(JSON.stringify(message))[0]["Body"];
	var angle = JSON.parse(bodyMsg).angle;
	var file = JSON.parse(bodyMsg).file;
	
	var params = {
		Bucket: 'tracz-lab4',
		Key: file
	};
	
	s3.getObject(params, function (err, data) {
		if (err) { console.log(1, err.stack); } 
		else {
			lwip.open(data.Body, 'jpg', function (err, image) {
				image.rotate(angle, function (err, image) {
					image.toBuffer('jpg', function (err, buffer) {
						var params1 = {
							Bucket: params.Bucket,
							Key: params.Key,
							Body: buffer,
							ACL: 'public-read'
						};
						
						s3.upload(params1, function (err, data) {
							if (err) console.log("wywala"); // an error occurred
							else console.log("Obrócono");           // successful response
						});
					});
				});
			});
		}
	});
    
}

function deleteMSG(message) {
	var params = {
		QueueUrl: 'https://sqs.us-west-2.amazonaws.com/983680736795/StepniewskiSQS',
		ReceiptHandle: message.ReceiptHandle
	};
	
	sqs.deleteMessage(params, null);
}

exports.executeRotateJob = executeRotateJob;