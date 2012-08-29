/* abstraction for http requests */

/* namespace */
var Ratio = Ratio || {};

/* definition */
Ratio.WebService = function () {

    /* imports */
    var Delegate = Ratio.Delegate;
    var Promise = Ratio.Promise;

    /* constructor */
    var WebService = function () {
        
    };

    /* prototype */

    /* getters/setters */
    WebService.prototype = {
        lastResult: null
    }

    /* public */
    WebService.prototype.initialize = function () {
        return this.exampleJSONRequest();
    }

    WebService.prototype.exampleJSONRequest = function () {
        var promise = new Promise();

        WinJS.xhr({ url: WebService.SAMPLE_JSON_FEED }).then(Delegate(this, function (request) {
            this.lastResult = JSON.parse(request.responseText);
            promise.resolve(this.lastResult);
        }), function (response) {
            promise.error(response) // error, typically no internet or bad url, unhandled this exception bubbles and causes problems
        });

        return promise;
    };

    /* statics */
    WebService.SAMPLE_JSON_FEED = "http://search.twitter.com/search.json?q=ratio%20interactive&rpp=5&include_entities=true&result_type=mixed";

    /* exports */
    return WebService;
}();