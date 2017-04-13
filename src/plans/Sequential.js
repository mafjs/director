var EventEmitter = require('event-emitter');

class SequentialPlan {

    constructor (logger, jobs, plan, planOptions) {
        this._logger = logger;
        this._jobs = jobs;
        this._plan = plan;
        this._planOptions = planOptions;

        this._events = new EventEmitter();
    }

    run () {

        return new Promise((resolve, reject) => {

        });

    }

}

module.exports = SequentialPlan;
