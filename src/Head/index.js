var _get = require('lodash.get');
var _set = require('lodash.set');

var DirectorHeadError = require('./Error');

class DirectorHead {

    /**
     * @param {Logger} logger
     */
    constructor (logger) {
        this.Error = DirectorHeadError;
        this._logger = logger;

        this._data = {};
    }

    /**
     * set
     *
     * @param {String|Array} name
     * @param {*} value
     * @return {this}
     */
    set (name, value) {
        _set(this._data, name, value);
        return this;
    }

    /**
     * get
     *
     * @param {String|Array} name
     * @param {*} defaultValue
     * @return {*}
     */
    get (name, defaultValue) {
        return _get(this._data, name, defaultValue);
    }
}

module.exports = DirectorHead;
