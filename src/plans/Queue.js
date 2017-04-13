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

        this._activeSteps = {};

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
                this._runStepFromQueue();
            }

        });

    }

    _next () {

        var queueCount = this._queue.length;
        var activeStepCount = Object.keys(this._activeSteps).length;

        this._logger.debug(
            `check done queueCount = ${queueCount}, activeStepCount = ${activeStepCount}`
        );

        if (queueCount === 0 && activeStepCount === 0) {
            this._events.emit('done');
            return;
        }

        if (queueCount === 0) {
            this._logger.debug(`queue empty, but ${activeStepCount} jobs still running`);
            return;
        }

        this._runStepFromQueue();

    }

    _runStepFromQueue () {
        var planId = this._queue.shift();
        this._runStep(planId, this._plan[planId]);
    }

    _runStep (planId, step) {
        this._activeSteps[planId] = step;

        var promises = [];

        if (Array.isArray(step)) {

            step.forEach((substep) => {
                promises.push(this._runJob(substep));
            });

        } else {
            promises.push(this._runJob(step));
        }

        Promise.all(promises)
            .then(() => {
                delete this._activeSteps[planId];
                this._events.emit('next');
            })
            .catch((error) => {
                delete this._activeSteps[planId];
                this._events.emit('error', error);
            });


    }

    _runJob (step) {
        // TODO if array run in parallel

        var handler = this.getJobHandler(step.job);

        // TODO logger for plan step
        return handler(this._logger, this._head, step.data)
            .then((result) => {
                step.result = result;

                return result;
                // delete this._activeSteps[planId];
                // this._events.emit('next');
            });
            // .catch((error) => {
                // delete this._activeSteps[planId];
                // this._events.emit('error', error);
            // });

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
