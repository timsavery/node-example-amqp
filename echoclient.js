var amqp = require('amqp'),
	util = require('util');

var replyTo = '127.0.0.1';
	
var c = amqp.createConnection();

c.on('ready', function() {
	c.exchange('test', {}, function(e) {
		
		// create a queue to receive responses
		c.queue('', { exclusive : true }, function(q) {
			
			// catch only messages that have the 'IEchoService' topic
			q.bind(e, replyTo);
			
			// create subscription
			q.subscribe(function (message, headers, deliveryInfo) {
				console.log(message);
			});			
			
			require('tty').setRawMode(true);
			var stdin = process.openStdin();
			
			stdin.on('keypress', function(chunk, key) {
				if (key && key.ctrl && key.name == 'c') {
					process.exit();
				}				
				
				var message = {
					operation : 'do',
					x : chunk
				};
				
				console.log('sending: ' + message);
								
				e.publish('IEchoService', message, {
					replyTo : replyTo,
					correlationId : 'xyz'
				});
			});		
		});
	});	
});