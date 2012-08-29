
WinJS.Namespace.define("Ratio.UI", {
    StatusView: WinJS.Class.define(//constructor, instanceMembers, staticMembers
    
    // constructor
    function (element, options) {
        this._initialize(element, options);
    },

    // object defining instance members
    {
        //element methods
        element: {
            get: function () {
                return this._element;
            }
        },

        addEventListener: function (eventName, eventCallBack, capture) {
            this._element.addEventListener(eventName, eventCallBack, capture);
        },

        removeEventListener: function (eventName, eventCallBack, capture) {
            return this._element.removeEventListener(eventName, eventCallBack, capture);
        },

        //progress methods
        isBusy: {
            get: function () {
                return this._busyCount > 0;
            },

            set: function (value) {
                if (value) {
                    this._busyCount += 1;
                }
                else {
                    this._busyCount -= 1;
                }

                this._updateBusyState();
            }
        },

        busyMessage: {
            get: function () {
                return this._busyMessage;
            },

            set: function (value) {
                this._busyMessage = value;
                this._updateBusyState();
            }
        },

        //connection state methods
        onlineMessage: {
            get: function () {
                return this._onlineMessage;
            },

            set: function (value) {
                this._onlineMessage = value;
                this._updateNetworkState();
            }
        },

        offlineMessage: {
            get: function () {
                return this._offlineMessage;
            },

            set: function (value) {
                this._offlineMessage = value;
                this._updateNetworkState();
            }
        },

        isOnline: {
            get: function () {
                return this._isOnline;
            },

            //make it private
            set: function (value) {
                this._isOnline = value;
                this._updateNetworkState();
            }
        },

        //message methods
        message: {
            get: function () {
                return this._message;
            },

            set: function (value) {
                this._message = value;
                this._updateMessage();
            }
        },

        //common methods
        reset: function () {
            this._isOnline = this._connectionState.state === "internet";
            this._busyCount = 0;
            this._message = "";
            this._update();
        },

        //private methods
        _updateBusyState: function () {
            //this._progressMessageElem.innerText = this.isBusy ? this.busyMessage : "";
            this._progressStatusElem.style.visibility = this._busyCount > 0 ? "visible" : "hidden";
        },

        _updateNetworkState: function () {
            this._networkStatusElem.innerText = this._isOnline ? this.onlineMessage : this.offlineMessage;
            this._networkStatusElem.style.visibility = !this._isOnline ? "visible" : "hidden";
        },

        _updateMessage: function () {
            this._messageElem.innerText = this._message;
        },

        _update: function () {
            this._updateBusyState();
            this._updateNetworkState();
            this._updateMessage();
        },

        _initialize: function (element, options) {
            options = options || {};

            this._element = element || document.createElement("div");
            this._element.winControl = this;

            //set the default values
            this._busyCount = 0;
            this._busyMessage = options.busyMessage || "loading...";;
            this._onlineMessage = options.onlineMessage || "";
            this._offlineMessage = options.offlineMessage || "offline";
            this._message = options.message || "";

            //set the inner elements
            this._progressStatusElem = this._element.querySelector("#progress-status");
            this._progressMessageElem = this._element.querySelector("#progress-message");
            this._networkStatusElem = this._element.querySelector("#network-status");
            this._messageElem = this._element.querySelector("#message");

            //initialize and handle connection change events
            this._subscribeToConnectionState();

            this._update();

            //register the status view
            Get.mapInstance("Ratio.UI.StatusView", this);
        },

        _subscribeToConnectionState: function () {
            var that = this;

            //get the connection state service
            this._connectionState = Get.Ratio.ConnectionState();

            //set the initial connection state
            this._isOnline = this._connectionState.state === "internet";

            this._connectionState.onConnectionLost.add(function () {
                that.isOnline = false;
            });

            this._connectionState.onConnection.add(function () {
                that.isOnline = true;
            });

            //start listening to connection state changes
            this._connectionState.start();
        },
    }
)});