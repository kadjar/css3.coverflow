// configure AppBarModel specifically for the project

/* namespace */
var Project = Project || {};

/* definition */
Project.AppBar = function () {
    "use strict";

    /* imports */
    var AppBarModel = Ratio.AppBarModel;

    /* constructor */
    var AppBar = function () {

        // state names for use in the application
        this.SPLASH = "splash";
        this.HOME = "home";
        this.COLLECTION = "collection";
        this.DETAIL = "detail";

        // map of commands to show for each state (maps to command ids)
        this._commandMatrix[this.SPLASH] = ["skip"];
        this._commandMatrix[this.HOME] = [];
        this._commandMatrix[this.COLLECTION] = [];
        this._commandMatrix[this.DETAIL] = [];

        // configuration methods mapped to each state.
        this._callbackMap = {};
        this._callbackMap[this.SPLASH] = this.stickyState;
        this._callbackMap[this.HOME] = this.defaultState;
        //this._callbackMap[this.COLLECTION] = this.defaultState;
        //this._callbackMap[this.DETAIL] = this.defaultState;
    };

    /* prototype */
    AppBar.prototype = new AppBarModel();

    /** 
    * Lookup and invoke a configuration methods mapped to this state.
    * @param {String} stateName  The new state the app bar needs to reflect
    */
    AppBar.prototype._updateStateHook = function (stateName) {
        var callback = this._callbackMap[stateName];
        callback && callback.apply(this);
    };

    /* exports */
    return AppBar;
}();