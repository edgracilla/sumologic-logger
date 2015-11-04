'use strict';

var platform = require('./platform'),
	request  = require('request'),
	httpSource;

/*
 * Listen for the log event.
 */
platform.on('log', function (logData) {
	if (!logData) return;

	request.post({
		url: httpSource,
		body: logData
	}, function (error) {
		if (error) platform.handleException(error);
	});
});

/*
 * Event to listen to in order to gracefully release all resources bound to this service.
 */
platform.on('close', function () {
	platform.notifyClose();
});

/*
 * Listen for the ready event.
 */
platform.once('ready', function (options) {
	httpSource = options.http_source;

	platform.notifyReady();
});