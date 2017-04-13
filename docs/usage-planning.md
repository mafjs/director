# usage planning


```js
var Director = require('maf-director');

var director = new Director(logger);

director.head.set('config', {
    name: 'team'
});

director.head.set('api', {
    tasks: {}, // task api object
});

director.addJob('job1', (logger, head, data) => {

    return new Promise((resolve, reject) => {

        head.get('api').tasks.add('some very important task');

        var name = head.get('config.name');

        resolve();
    });

});

director.addJobs({
    job2: (logger, head, data) => {

        return new Promise((resolve, reject) => {
            // get data from job1
            head.get('api').tasks.getAllTasks();

            resolve({
                result: true
            });
        });

    },
    job3: () => {},
    job4: () => {}
});


// director.PLAN.SEQUENTIAL - jobs execute sequentially
// director.PLAN.QUEUE - jobs execute

director

.setPlanType(director.PLAN.SEQUENTIAL)
// OR
.setPlanType(director.PLAN.QUEUE, {workers: 3})

.setPlan(
    [
        // first make job1
        {
            job: 'job1',
            data: {a: 1}
        },

        // then job2 and job3 in parallel
        [
            {
                job: 'job2',
                data: {b: 2}
            },
            {
                job: 'job3',
                data: {c: 3}
            }
        ],

        // and after job4
        {
            job: 'job4',
            data: {d: 4}
        }
    ]
);


director.run()
    .then(() => {

    })
    .catch((error) => {

    });


```
