// Allows delaring all AppBar buttons inside the AppBar html, then mapping which ones are visible to specific views or states

/* namespace */
var Ratio = Ratio || {};

/* definition */
Ratio.AppBarModel = function () {
    "use strict";

    /* imports */
    var Promise = Ratio.Promise;
    var Delegate = Ratio.Delegate;

    /* constructor */
    var AppBarModel = function () {
        
    };

    /* prototype */
    AppBarModel.prototype = {
        _commandMatrix: {}, // map of state -> array of command ids
        _commands: {}, // has of AppBarCommands
        _commandArr: [], // collection of AppBarCommands

        _state: "",
        state: {
            get function() {
                return this._state;
            }
        },

        _appBar: null, 
        appBar: {
            get function() {
                return this._appBar;
            }
        }
    };

    /** 
    * Get references to all commands declared in the appbar, map them as properties on this object for convenience
    * @param {Object} appBar  A reference to the winControl property of the AppBar
    */
    AppBarModel.prototype.initialize = function (appBar) {
        if (!appBar) throw new Error("missing required param 'appBar'");
        this._appBar = appBar;

        // map AppBarCommands to 'commands' object and as local properties on AppBarModel instance
        var commandElements = appBar.element.children;
        for (var p in commandElements) { // where 'p' is like 'addToFavorites'
            if (this.hasOwnProperty(p) || AppBarModel.prototype.hasOwnProperty(p))
                throw Error("mapping an AppBarCommand to a property that already exists on AppBarModel");

            if (!/length|item|namedItem/g.test(p)) { // exclude irrelevant properties of 'element.children' obj
                this[p] = this._commands[p] = commandElements[p].winControl; // todo: might need to exclude non-AppBarCommand elements
                this._commandArr.push(commandElements[p].winControl);
            }
        }

        this._initializeHook && this._initializeHook(appBar); // allow descendant to tie into initialization

        this.updateState(); // initialize app bar with no commands
    };

    /** 
    * Use the page name to show relevant commands, hide all the others. 
    * @param {String} stateName  String that command ids are mapped to. 'undefined' will clear commands
    */
    AppBarModel.prototype.updateState = function (stateName) {
        this._state = stateName;

        var currentCommands = [];
        var stateCommandIds = this._commandMatrix[stateName] || []; // get command ids mapped to the specific state
        for (var p in stateCommandIds) {
            var id = stateCommandIds[p];
            var command = this._commands[id];
            if (command)
                currentCommands.push(command);
            else
                throw new Error("command not found for id'" + id + "'");
        }

        this._appBar.hideCommands(this._commandArr); // make sure no left over commands are shown
        this._appBar.showCommands(currentCommands);

        this._appBar.disabled = (!stateCommandIds.length); // disable the app bar if there are no commands
        this._updateStateHook && this._updateStateHook(stateName); // let any subclass tie into state updates
    };

    AppBarModel.prototype.isVisible = function () {
        return (!this._appBar.hidden);
    };

    AppBarModel.prototype.show = function () {
        var promise = new Promise();
        this._appBar.onaftershow = Delegate(promise, promise.resolve);
        this._appBar.show();
        return promise;
    };

    AppBarModel.prototype.hide = function () {
        var promise = new Promise();
        this._appBar.onafterhide = Delegate(promise, promise.resolve);
        this._appBar.hide();
        return promise;
    };

    AppBarModel.prototype.defaultState = function () {
        this._appBar.hide();
        this._appBar.sticky = false;
    };

    AppBarModel.prototype.stickyState = function () {
        this._appBar.show();
        this._appBar.sticky = true;
    };

    /* exports */
    return AppBarModel;
}();
