"use strict"

/**
 * Lo
 *
 *
 *
 *
 */


var log4js = require('log4js');
var syslog = require('ain2');
var glossy = require('glossy');


/**
 *
 * @param config
 * @param layout
 * @returns {Function}
 */
function syslogAppender(config, layout) {

    /**
     * adding log level to message string
     *
     * @param loggingEvent
     * @returns {*}
     */
    var fixedLayout = function (loggingEvent) {
        if (layout) {
            return layout(loggingEvent);
        } else {
            return log4js.layouts.messagePassThroughLayout(loggingEvent);
        }
    };

    var tag = config.tag || "log4js";
    var facility = config.facility || "local0";
    var hostname = config.hostname || "localhost";
    var port = config.port || 514;
    var transport = config.transport || "UDP";
    var path = config.path || "/dev/log";
    var rfc = config.rfc || 'RFC5424';
    var logger;

    if(transport === "UDP"){
        logger = new syslog({transport: "UDP", tag: tag, facility: facility, hostname: hostname, port: port});
    } else if(transport === "socket"){
        logger = new syslog({transport: "unix_dgram", tag: tag, facility: facility, path: path});
    }

    var producer = new glossy.Produce({
        type:     rfc, // RFC3164 or RFC5424
        appName:  tag,
        pid:      process.pid,
        facility: facility
        //host: hostname
    });

    logger.setMessageComposer(function(message, severity) {
        var syslogMsg = producer.produce({
            severity: severity,
            date: new Date(),
            message: message
        });

        return new Buffer(syslogMsg);
    });

    /**
     * the logging
     */
    return function (loggingEvent) {

        var logLevels = {
            5000: logger.debug, // MC Pavel Kriz: map trace->debug to avoid syslog.trace (as it would dump the whole stacktrace to the syslog) when log4js.trace is called
            10000: logger.debug,
            20000: logger.info,
            30000: logger.warn,
            40000: logger.error,
            50000: logger.error
        };

        var level = loggingEvent.level.level;

        logLevels[level].call(logger, fixedLayout(loggingEvent));
    };
}

/**
 *
 * @param config
 * @returns {*}
 */
function configure(config) {

    var layout;

    if (config.layout) {
        layout = log4js.layouts.layout(config.layout.type, config.layout);
    }
    return syslogAppender(config, layout);
}

module.exports.name = "mc-log4js-syslog-appender";
module.exports.appender = syslogAppender;
module.exports.configure = configure;
