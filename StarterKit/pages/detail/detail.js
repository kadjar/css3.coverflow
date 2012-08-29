
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/detail/detail.html", { ready: ready, unload: unload, updateLayout: updateLayout });

    function ready(element, options) {
        // page initialization
        initDetails(options);
    }

    function unload() {
        // unload page
    }

    function updateLayout(element, viewState, lastViewState) {
        // handle screen orientation changes.
    }

    function initDetails(options) {
        var viewModel = Get("Ratio.ViewModel");
        var title = document.getElementById("detailsTitle");
        var details = document.getElementById("details");
        if (options.home) {
            var item = viewModel._getProductByTitle(options.home.title);
            title.textContent = options.home.title;
        }
        else {
            var item = viewModel._getProductByTitle(options.collection.title);
            title.textContent = options.collection.title;
        }
        
        details.textContent = item[0].description;
    }
})();
