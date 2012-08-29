// Signal - mediator for communication between objects

var Ratio = Ratio || {};

Ratio.Signal = function () {
    "use strict";

    // === constructor and instance members ===
    var Signal = function () {
        this._callback = null;
        this._dispatchStrategy = this._dispatchOne; // initialize with the singular dispatching strategy
    };

    // === prototype members ===
    Signal.prototype.add = function (callback) {
        if (this._callback !== null) { // if a callback has already been added
            this._callback = [this._callback]; // wrap it in an array so more can be added
            this._dispatchStrategy = this._dispatchMultiple; // change to plural dispatching strategy
        }

        if (Array.isArray(this._callback)) // determine the appropriate way to store this callback
            this._callback.push(callback);
        else
            this._callback = callback;

        return this;
    };

    Signal.prototype.dispatch = function (args) {
        return this._dispatchStrategy.apply(this, arguments);
    };

    Signal.prototype._dispatchOne = function (args) {
        if (this._callback)
            return this._callback.apply(this, arguments);
    };

    Signal.prototype._dispatchMultiple = function (args) {
        for (var i = 0; i < this._callback.length; i++)
            this._callback[i].apply(this, arguments);
    };

    return Signal;
}();