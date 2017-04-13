var path = require('path');

var root = path.resolve(`${__dirname}/../../package`);

var t = require('tap');
var prequire = require('proxyquire');



t.test('#constructor', function (t) {

    t.test('should create instance', function (t) {

        var logger = {};

        var Head = prequire(`${root}/Head`, {});

        new Head(logger);

        t.end();

    });

    t.end();
});

t.test('#get', function (t) {

    t.test('should call lodash.get and return result', function (t) {
        var logger = {};

        var Head = prequire(`${root}/Head`, {

            'lodash.get': function (data, name, defaultValue) {
                t.type(data, 'object');
                t.equal(name, 'test');
                t.equal(defaultValue, 'defaultValue');

                return 'some-value';
            }

        });

        var head = new Head(logger);

        var value = head.get('test', 'defaultValue');

        t.equal(value, 'some-value');

        t.end();

    });


    t.end();
});


t.test('#set', function (t) {

    t.test('should call lodash.set and return this', function (t) {

        var logger = {};

        var Head = prequire(`${root}/Head`, {

            'lodash.set': function (data, name, value) {
                t.type(data, 'object');
                t.equal(name, 'test');
                t.same(value, {a: 1});
            }

        });

        var head = new Head(logger);

        var result = head.set('test', {a: 1});

        t.same(result, head);

        t.end();

    });


    t.end();
});
