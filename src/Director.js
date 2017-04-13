var DirectorError = require('./Error');

var DirectorHead = require('./Head');

var PlanTypes = {
    SEQUENTIAL: 'SEQUENTIAL',
    QUEUE: 'QUEUE'
};

class Director {

    /**
     * @param {Logger} logger
     */
    constructor (logger) {
        this.Error = DirectorError;
        this._logger = logger;

        this.PLAN = PlanTypes;

        this._head = new DirectorHead(logger);

        this._jobs = {};

        this._planType = this.PLAN.QUEUE;

        this._planOptions = {
            workers: 1
        };

        this._plan = [];

    }

    get head () {
        return this._head;
    }

    addJob (name, handler) {
        // TODO validate name, handler
        // - name String
        // - handler Function
        this._jobs[name] = handler;

        return this;
    }

    addJobs (jobs) {
        // TODO validate jobs object
        // key String
        // value Function
        for (var name in jobs) {
            this._jobs[name] = jobs[name];
        }

        return this;
    }

    setPlanType (type, options) {
        // TODO validate type and options
        this._planType = type;

        if (options) {
            this._planOptions = options;
        }

    }

    setPlanOptions (options) {
        this._planOptions = options;
    }

    setPlan (plan) {
        // TODO validate plan - Array, item object or Array of Object
        // Object - {job: '<String>', data: Object|String|...}

        this._plan = plan;

        return this;
    }

    run () {

        return new Promise((resolve, reject) => {

            if (this._plan.length === 0) {
                return reject(new this.Error(this.Error.CODES.NO_PLAN));
            }

            if (Object.keys(this._jobs).length === 0) {
                return reject(new this.Error(this.Error.CODES.NO_JOBS));
            }

            var QueuePlan = require('./plans/Queue');

            var plan = new QueuePlan(
                this._logger,
                this._head,
                this._jobs,
                this._plan,
                this._planOptions
            );

            plan.run()
                .then(() => {
                    resolve(this._plan);
                })
                .catch((error) => {
                    reject(error);
                });

        });

    }

}

Director.PLAN = PlanTypes;

module.exports = Director;
