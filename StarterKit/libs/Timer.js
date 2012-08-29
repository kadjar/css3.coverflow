// Timer - set a delay or interval before invoking 'then' method.
// Defining a 'delay' invokes 'then' once and stops the timer. Defining an 'interval' invokes 'then' repeatedly at that interval.
// Invoke 'start' to start the timer. Invoking start again restarts the timer. 'stop' resets the timer (and stops it).
// example:
// timer = new Timer().delay(750).then(onTimerComplete);
// timer.start();

var Ratio = Ratio || {};

Ratio.Timer = (function () {
    "use strict";

    // === constructor and instance members ===
    var Timer = function () {
        var _interval = null;
        var _delay = null;
        var _timerId = 0;
        this.ontick;
    };

    // === prototype members ===
    Timer.prototype.delay = function (delay) {
        this._delay = delay;
        this._interval = null;
        return this;
    };

    Timer.prototype.interval = function (interval) {
        this._delay = null;
        this._interval = interval;
        return this;
    };

    Timer.prototype.start = function (oneTimeDelay) {
        this.stop();

        var self = this;
        this._timerId = setInterval(function () {

            self.ontick();
            if (!this._interval)
                self.stop();

        }, oneTimeDelay || this._delay || this._interval);

        return this;
    };

    Timer.prototype.stop = function () {
        clearInterval(this._timerId);
        return this;
    };

    Timer.prototype.then = function (ontick) {
        this.ontick = ontick;
        return this;
    };

    // === static members ===

    return Timer;
})();
