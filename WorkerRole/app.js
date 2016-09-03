var AWS = require("aws-sdk");
var RotateService = require('./jobs/rotateJob');
AWS.config.loadFromPath('./config.json');
var InfiniteLoop = require('infinite-loop');
var il = new InfiniteLoop;
var sqs = new AWS.SQS();

il.add(waitForMessages, null).setInterval(100).run();


function waitForMessages() {
	var params = {
		QueueUrl: 'https://sqs.us-west-2.amazonaws.com/983680736795/hufnagielSQS',
		MaxNumberOfMessages: 1,
		VisibilityTimeout: 30,
		WaitTimeSeconds: 20
	};
	
	sqs.receiveMessage(params, function (err, data) {
		if (err) {
			console.log(err);
		} else {
			var messages = data.Messages || [];
			if (messages.length > 0) {
				var deleteParams = {
					QueueUrl: 'https://sqs.us-west-2.amazonaws.com/983680736795/hufnagielSQS',
					ReceiptHandle: JSON.parse(JSON.stringify(messages))[0]["ReceiptHandle"]
				};
				sqs.deleteMessage(deleteParams, function (err, data) {
					if (err) { console.log(err, err.stack); }
					else { RotateService.executeRotateJob(messages); }
				});
			}
		}
	});

}