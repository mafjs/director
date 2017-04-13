var path = require('path');

var root = path.resolve(`${__dirname}/../../package`);

var t = require('tap');
var prequire = require('proxyquire');



t.test('#constructor', function (t) {

    t.test('should create instance', function (t) {

        var logger = {};

        var Director = prequire(`${root}/Director`, {});

        new Director(logger);

        t.end();

    });

    t.end();
});
