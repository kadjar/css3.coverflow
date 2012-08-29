// Promise - Allows syntactically streamlined callback code using inline 'then' and 'fail' function declaRations

var Ratio = Ratio || {};

Ratio.Promise = function () {
    "use strict";

    var Signal = Ratio.Signal;

    // === constructor and instance members ===
    var Promise = function (optionalDescription) {
        this.description = optionalDescription;
        this.readyState = Promise.UNINITIALIZED;

        this._onResolve = null;
        this._onError = null;
    };

    // === prototype members ===
    Promise.prototype.resolve = function (args) {
        if (!this._onResolve && this.readyState == Promise.UNINITIALIZED)
            console.log("'then' callback was never set, code may have executed synchronously before 'then' was set");
        else
            this._onResolve.dispatch.apply(this._onResolve, arguments);
        this.readyState = Promise.DONE;
    };

    Promise.prototype.error = function (args) {
        this.readyState = Promise.ERROR;
        if (!this._onError)
            console.log("'fail' callback was never set, code may have executed synchronously before 'fail' was set");
        else
            this._onError.dispatch.apply(null, arguments);
    };

    Promise.prototype.then = function (thenCallback) {
        !this._onResolve && (this._onResolve = new Signal());
        this._onResolve.add(thenCallback);
        this.readyState = Promise.PENDING;
        return this;
    };

    Promise.prototype.fail = function (failCallback) {
        !this._onError && (this._onError = new Signal());
        this._onError.add(failCallback);
        return this;
    };

    // === static members ===
    Promise.UNINITIALIZED = "0";
    Promise.PENDING = "1";
    Promise.DONE = "2";
    Promise.ERROR = "3";

    return Promise;
}();