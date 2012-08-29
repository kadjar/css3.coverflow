/*  */

/* namespace */
var Ratio = Ratio || {};

/* definition */
Ratio.DataService = function () {

    /* constructor */
    var DataService = function () {

    };

    /* prototype */

    /* public */
    DataService.prototype.initialize = function () {
        var promise = Get("Ratio.Promise");

        var webService = Get("Ratio.WebService");
        webService.lastResult;
        setTimeout(function () { promise.resolve()  }, 2500); // temp
        return promise;
    };


    /* exports */
    return DataService;
}();