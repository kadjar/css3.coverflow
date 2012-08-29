/* namespace */
var Ratio = Ratio || {};

/* definition */
Ratio.ConnectionState = function () {

    /* imports */
    var Signal = Ratio.Signal;
    var Delegate = Ratio.Delegate;

    var NetworkConnectivityLevel = Windows.Networking.Connectivity.NetworkConnectivityLevel;

    /* constructor */
    var ConnectionState = function () {
        // public api
        this.onConnection = new Signal();
        this.onConnectionLost = new Signal();
        this.onConnectionChange = new Signal();

        // initialization
        this._changeDelegate = Delegate(this, this._onConnectionChange); // reference the delegate so it can be removed
        this._networkInformation = Windows.Networking.Connectivity.NetworkInformation;
        this._setState();
    };

    /* prototype */

    /* getters/setters */
    ConnectionState.prototype = {
        get state() {
            return this._state;
        }
    }

    /* public */
    ConnectionState.prototype.start = function () {
        this._networkInformation.addEventListener("networkstatuschanged", this._changeDelegate);
    };

    ConnectionState.prototype.stop = function () {
        this._networkInformation.removeEventListener("networkstatuschanged", this._changeDelegate);
    };


    /* private */
    ConnectionState.prototype._onConnectionChange = function (e) {
        this._setState();
    };

    ConnectionState.prototype._setState = function () {
        var prevState = this._state;

        var connectionProfile = this._networkInformation.getInternetConnectionProfile();
        var connectionLevel = (connectionProfile) ? connectionProfile.getNetworkConnectivityLevel() : 0;

        switch (connectionLevel) {
            case NetworkConnectivityLevel.internetAccess:
                this._state = ConnectionState.INTERNET;
                this.onConnection.dispatch();
                break;

            default:
                this._state = ConnectionState.NO_INTERNET;
                this.onConnectionLost.dispatch();
                break;
        }

        if (prevState && prevState != this._state)
            this.onConnectionChange.dispatch(this._state);
    };

    /* statics */
    ConnectionState.INTERNET = "internet";
    ConnectionState.NO_INTERNET = "noInternet";

    /* exports */
    return ConnectionState;
}();