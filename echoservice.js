var amqp = require('amqp'),
	util = require('util');

// connect to the amqp server
var c = amqp.createConnection()

c.on('ready', function() {	
	c.exchange('test', {}, function(e) {
		
		// create/attach to the 'messages' queue
		c.queue('IEchoService', function(q) {
			
			// catch only messages that have the 'IEchoService' topic
			q.bind(e, 'IEchoService');
			
			// create subscription
			q.subscribe(function (message, headers, deliveryInfo) {
				console.log(message);
				
				var result = echoService[message.operation](message.x);
					
				e.publish(deliveryInfo.replyTo, result, {
					contentType : 'application/json',
					correlationId : deliveryInfo.correlationId
				});
			});
		});
	});
});

var echoService = {
	'do' : function(x) {
		return {
			result : 'did something with "' + x + '"'
		};
	}
};