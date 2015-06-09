(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return (root.time = factory());
        });
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.time = factory();
    }
}(this, function () {
    
    return function () {
        var date = new Date(),
            h = date.getHours(),
            m = date.getMinutes();
        return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
    };

}));