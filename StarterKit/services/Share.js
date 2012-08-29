/* namespace */
var Ratio = Ratio || {};

/* definition */
Ratio.Share = function () {
    "use strict";

    var _data;

    /* constructor */
    var Share = function () { };

    /* statics */
    Share.enable = function (data) {
        _data = data;
        var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
        dataTransferManager.ondatarequested = onShareRequested;
    };

    Share.disable = function () {
        var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
        dataTransferManager.ondatarequested = null;
    };

    /* private */
    function onShareRequested (e) {
        var request = e.request;
        var deferral = request.getDeferral();

        // build share html
        var shareHtml = "";

        var obj = Windows.ApplicationModel.DataTransfer.HtmlFormatHelper.createHtmlFormat(shareHtml);
        request.data.setHtmlFormat(obj);
        request.data.properties.title = ""; // title is required

        deferral.complete();
    }

    return Share;
}();