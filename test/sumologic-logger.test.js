'use strict';

const HTTP_SOURCE = 'https://endpoint1.collection.us2.sumologic.com/receiver/v1/http/ZaVnC4dhaV1s87-rYBpjBN8Orv_DKkRQY1gcB4t44q3jczX8RXWl88TpJuJ_eON6A5rEm7oknLQTkEtOnXiX_PtBLBQ3GG0DLSohadHKN1dNgSX8rv00Cw==';

var cp     = require('child_process'),
	assert = require('assert'),
	logger;

describe('Logger', function () {
	this.slow(5000);

	after('terminate child process', function () {
		setTimeout(function () {
			logger.kill('SIGKILL');
		}, 5000);
	});

	describe('#spawn', function () {
		it('should spawn a child process', function () {
			assert.ok(logger = cp.fork(process.cwd()), 'Child process not spawned.');
		});
	});

	describe('#handShake', function () {
		it('should notify the parent process when ready within 5 seconds', function (done) {
			this.timeout(5000);

			logger.on('message', function (message) {
				if (message.type === 'ready')
					done();
			});

			logger.send({
				type: 'ready',
				data: {
					options: {
						http_source: HTTP_SOURCE
					}
				}
			}, function (error) {
				assert.ifError(error);
			});
		});
	});

	describe('#logJSON', function () {
		it('should process the json log data', function (done) {
			logger.send({
				type: 'log',
				data: JSON.stringify({
					title: 'Sumologic Test Log',
					description: 'This is a sample JSON log data to test sumologic'
				})
			}, done);
		});
	});

	describe('#logString', function () {
		it('should process the string log data', function (done) {
			logger.send({
				type: 'log',
				data: 'This is a sample String log data to test sumologic'
			}, done);
		});
	});
});