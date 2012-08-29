// Delegate - Streamlined way of invoking a callback from the correct 'this' reference

var Ratio = Ratio || {};

Ratio.Delegate = function () {
    "use strict";
    
    var Delegate = function (context, method) {

        return function (args) {
            method.apply(context, arguments);
        };
    };

    return Delegate;
}();