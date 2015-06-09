(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return (root.ip = factory());
        });
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.ip = factory();
    }
}(this, function () {
    var os = require('os');
    
    return function () {
        var ret = '127.0.0.1';
        var interfaces = os.networkInterfaces();

        Object.keys(interfaces).forEach(function (el) {
            interfaces[el].forEach(function (el2) {
                if (!el2.internal && el2.family === 'IPv4') {
                    ret = el2.address;
                }
            });
        });

        return ret;
    };
    
}));