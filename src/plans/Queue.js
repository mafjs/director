var EventEmitter = require('event-emitter');

class QueuePlan {

    constructor (logger, head, jobs, plan, planOptions) {
        this._logger = logger;
        this._head = head;

        this._jobs = jobs;

        this._plan = plan;

        this._planOptions = planOptions || {};

        if (!this._planOptions.workers) {
            this._planOptions.workers = 1;
        }

        this._queue = [];

        this._activeJobs = {};

        this._events = new EventEmitter();
    }

    run () {

        return new Promise((resolve, reject) => {

            this._init();

            this._events.on('error', function (error) {
                reject(error);
            });

            this._events.on('next', () => {
                this._next(resolve, reject);
            });

            this._events.on('done', function () {
                resolve();
            });

            for (var i = 0; i < this._planOptions.workers; i++) {
                this._runJobFromQueue();
            }

        });

    }

    _next () {

        var queueCount = this._queue.length;
        var activeJobsCount = Object.keys(this._activeJobs).length;

        this._logger.debug(
            `check done queueCount = ${queueCount}, activeJobsCount = ${activeJobsCount}`
        );

        if (queueCount === 0 && activeJobsCount === 0) {
            this._events.emit('done');
            return;
        }

        if (queueCount === 0) {
            this._logger.debug(`queue empty, but ${activeJobsCount} jobs still running`);
            return;
        }

        this._runJobFromQueue();

    }

    _runJobFromQueue () {
        var planId = this._queue.shift();
        this._runJob(planId, this._plan[planId]);
    }

    _runJob (planId, step) {
        // TODO if array run in parallel

        this._activeJobs[planId] = step;

        var handler = this.getJobHandler(step.job);

        // TODO logger for plan step
        handler(this._logger, this._head, step.data)
            .then((result) => {
                step.result = result;
                delete this._activeJobs[planId];
                this._events.emit('next');
            })
            .catch((error) => {
                delete this._activeJobs[planId];
                this._events.emit('error', error);
            });

    }

    getJobHandler (name) {
        // TODO check job exists
        return this._jobs[name];
    }

    _init () {
        // queue plan
        for (var i in this._plan) {
            this._queue.push(i);
        }

    }

}

module.exports = QueuePlan;
