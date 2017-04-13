require('source-map-support').install();

var Director = require(`${__dirname}/../package/Director`);

var logger = require('log4js-nested').getLogger();

var director = new Director(logger);

director.addJob('echo', function (logger, head, data) {

    return new Promise((resolve, reject) => {
        setTimeout(function () {
            console.log(data);
            resolve(data);
        }, 1000);

    });

});

var plan = [];

for (var i = 0; i < 10; i++) {
    plan.push([{job: 'echo', data: i + '-1'}, {job: 'echo', data: i + '-2'}]);
}

director.setPlan(plan);

director.setPlanOptions({workers: 5});

director.run()
    .then((result) => {
        logger.info('done');
        console.log(JSON.stringify(result, null, '    '));
    })
    .catch((error) => {
        logger.error(error);
    });
