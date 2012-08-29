
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/splash/splash.html", { ready: ready, unload: unload, updateLayout: updateLayout });

    function ready(element, options) {
        // page initialization

        positionSplashImage(options);
        showMessage();
        initDataContext();

        Get("AppBar").updateState("splash");
        Get("AppBar").skip.onclick = onReady;
    }

    function unload() {
        // unload page
    }

    function updateLayout(element, viewState, lastViewState) {
        // handle screen orientation changes.
    }

    function positionSplashImage (coordinates) {
        var splashImage = document.getElementById("extended-splash-image");
        splashImage.style.left = coordinates.x + "px";
        splashImage.style.top = coordinates.y + "px";
        splashImage.style.height = coordinates.height + "px";
        splashImage.style.width = coordinates.width + "px";
    }

    function showMessage() {
        var statusView = Get("Ratio.UI.StatusView");
        statusView.isBusy = true;
        statusView.message = "Extended Splash Screen: show custom loading indicator while initializing application";
    }

    function hideMessage() {
        var statusView = Get("Ratio.UI.StatusView");
        statusView.isBusy = false;
        statusView.message = "";

        var splashBackground = document.getElementById("extended-splash-image");
        splashBackground.removeNode();
    }

    var dataContext;
    function initDataContext() {
        dataContext = Get.Ratio.DataContext();
        dataContext.onReady.add(onReady);
        dataContext.onError.add(onError);
        dataContext.initialize();
    }

    function onReady(message) {
        hideMessage();

        // start the app
        WinJS.Navigation.navigate("/pages/home/Home.html");
    }

    function onError(message) {
        
    }

})();
