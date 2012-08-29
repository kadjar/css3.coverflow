//Basic unit for executing a graph of closures synchronously and/or concurrently. 

/* namespace */
var Ratio = Ratio || {};

/* definition */
Ratio.Task = function () {

    /* constructor */
    var Task = function () {
        this._nextNodes = [];
        this._previousNodes = [];
    };

    /* prototype */

    /* getters/setters */
    Task.prototype = {
        _executeObj: null, // object
        _executeParams: null, // array
        _hasCompleted: false,
        get hasCompleted() {
            return this._hasCompleted;
        }
    }

    /* public */
    Task.prototype.addPrevious = function (taskNode) {
        this._previousNodes.push(taskNode);
        return this;
    }

    Task.prototype.addNext = function (taskNode) {
        this._nextNodes.push(taskNode);
        return this;
    }

    /** Called on completion of every upstream execute, only executes when all upstream nodes have completed. */
    Task.prototype.execute = function () {
        // Check that each upstream Task task has completed.
        for (var i in this._previousNodes) {
            var taskNode = this._previousNodes[i];
            if (!taskNode.hasCompleted) // exit if any tasks haven't completed.
                return;
        }

        this._preExecute && this._preExecute();
        this.work && this.work();
        //this._postExecute();
    }

    /** A closure to execute when this Task is run. */
    Task.prototype.work = null;

    /** Invoked before the command is executed. Subclass may add listeners here if the task is asynchronous. */
    Task.prototype._preExecute = null;

    /** Begin execution of any child Task nodes. */
    Task.prototype.next = function () {
        this._hasCompleted = true;

        for (var i in this._nextNodes) {
            var taskNode = this._nextNodes[i];
            taskNode.execute();
        }
    }

    Task.join = function (prev, next) {
        prev.addNext(next);
        next.addPrevious(prev);
    }

    /* exports */
    return Task;
}();