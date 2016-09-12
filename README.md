# mc-log4js-syslog-appender based on log4js-syslog-appender

This is a syslog appender for log4js. It is a rewrite of https://www.npmjs.com/package/log4js-node-syslog. It uses ain2 (https://github.com/phuesler/ain) again since node-syslog does not work with the latest versions of node. 

It uses fixed glossy (https://github.com/pavkriz/glossy) library for producing correct syslog messages. 

log4js-syslog-appender works with node versions 0.10.x, 0.11.x and 0.12.x.
 
NOTE: Tests are not accommodated to mc-log4js-syslog-appender.

## Installation

	npm install pavkriz/mc-log4js-syslog-appender --save

## Configuration

In your log4js config you can use the following configuration:

### UDP

	"appender": {
		"type": "mc-log4js-syslog-appender",
		"tag": "YOUR LOG TAG",
		"facility": "local0",
		"hostname": "localhost",
		"port": 514,
		"transport": "UDP",
		"rfc": "RFC5424"
    }

Options:

* `tag`: appears in front of your log message in the syslog / default: `log4js`
* `facility`: your syslog facility / default: `local0`
* `hostname`: hostname of your syslog server / default: `localhost`
* `port`: port of your syslog server / default: `514`
* `transport`: how to connect to syslog server / default: `UDP`
* `rfc`: RFC to conform to; RFC3164 or RFC5424 / default: `RFC5424`

### Socket

	"appender": {
		"type": "mc-log4js-syslog-appender",
		"tag": "YOUR LOG TAG",
		"facility": "local0",
		"path": "/dev/log",
		"transport": "socket",
		"rfc": "RFC5424"
    }
    
Options:

* `tag`: appears in front of your log message in the syslog / default: `log4js`
* `facility`: your syslog facility / default: `local0`
* `path`: path to your syslog socket / default: `/dev/log`
* `transport`: how to connect to syslog server / default: `UDP`
* `rfc`: RFC to conform to; RFC3164 or RFC5424 / default: `RFC5424`

## Example:

	var log4js = require('log4js');

	log4js.configure({
    	appenders: [ 
        { 
            type: 'mc-log4js-syslog-appender', 
            tag: 'My API', 
            facility: 'local0', 
            hostname: 'localhost', 
            port: 514
        }
    ]});

	var logger = log4js.getLogger('syslog');

	logger.trace('a trace message');
	logger.debug('a debug message');
	logger.info('an info message');
	logger.warn('a warning message');
	logger.error('an error message');
	logger.fatal('a fatal message');


This should produce messages in your syslog similar to this:
	
	Jan 27 17:08:12 2015-01-27T16:08:12.808Z localhost My API[52315]: [WARN] - a warning message
	Jan 27 17:08:12 2015-01-27T16:08:12.808Z localhost My API[52315]: [ERROR] - an error message
	Jan 27 17:08:12 2015-01-27T16:08:12.808Z localhost My API[52315]: [FATAL] - a fatal message
	
Please note! Depending on your syslog setup trace, debug and info might not appear in the syslog.

## Troubleshooting

If you want to send log messages via UDP, your syslog setup must accept network sockets in order to receive messages. Most syslog implementations have UDP disabled by default.

For further information see https://github.com/phuesler/ain.

## Development

	npm install
	npm test
