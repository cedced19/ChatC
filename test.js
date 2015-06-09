'use strict';

var time = require('./app/vendor/js/time'),
    ip = require('./app/vendor/js/ip');

describe('time-plugin', function () {

    it('should give the time', function () {
        time();
    });

});

describe('ip-plugin', function () {

    it('should give the local ip', function () {
        ip();
    });

});