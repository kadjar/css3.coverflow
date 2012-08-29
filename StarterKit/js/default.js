
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;


    function defineResources() {
        // map objects needed throughout the application
        Get.map("Ratio.Promise", Ratio.Promise);
        Get.map("Ratio.Signal", Ratio.Signal);
        Get.map("Ratio.Timer", Ratio.Timer);
        Get.mapConstructor("Ratio.Task", Ratio.Task);
        Get.map("Ratio.ConnectionState", Ratio.ConnectionState, true);

        Get.map("Ratio.WebService", Ratio.WebService, true);
        Get.map("Ratio.Repository", Ratio.Repository, true);
        Get.map("Ratio.DataService", Ratio.DataService, true);
        Get.map("Ratio.DataContext", Ratio.DataContext, true);

        Get.mapConstructor("Ratio.IdbOrm", Ratio.IdmOrm);


        Get.mapSingleton("AppBar", Project.AppBar);
        Get.mapSingleton("Ratio.ViewModel", Ratio.ViewModel);

        Get.mapStatic("Ratio.FileService", Ratio.FileService);
    }

    function mapAppBar() {
        var appBar = document.getElementById("appbar");
        var appBarModel = Get("AppBar");
        appBarModel.initialize(appBar.winControl);
    }


    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // This application has been newly launched. Initialize.
                defineResources();

            } else {
                // This application has been reactivated from suspension. Restore application state.
            }

            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }
            args.setPromise(WinJS.UI.processAll().then(function () {
                mapAppBar();

                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(Application.navigator.home, args.detail.splashScreen.imageLocation);
                }
            }));
        }

        if (args.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.search) {
            if (args.detail.previousExecutionState === Windows.ApplicationModel.Activation.ApplicationExecutionState.running
                || args.detail.previousExecutionState === Windows.ApplicationModel.Activation.ApplicationExecutionState.suspended) {
                if (args.detail.queryText) {
                    handleSearchEntry(args.detail.queryText);

                }
            }

            // app was not running at all when searched
            if (args.detail.previousExecutionState !== Windows.ApplicationModel.Activation.ApplicationExecutionState.terminated) {
                defineResources();
                // the app needs to initialize before navigation can occur?
                args.setPromise(WinJS.UI.processAll().then(function () {
                    if (args.detail.queryText) { // package up the method for Dashboard to execute when it's ready
                        pendingNavigation = function () { handleSearchEntry(args.detail.queryText) };
                    }

                    if (nav.location) {
                        nav.history.current.initialPlaceholder = true;
                        return nav.navigate(nav.location, nav.state);
                    } else {
                        return nav.navigate(Application.navigator.home);
                    }
                }));
            }
        }
    });

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous opeRation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
    };

    app.onsettings = function (e) {
        // Register settings flyouts
        e.detail.applicationcommands = {
            "AboutDiv": { href: "/helpers/about.html", title: "About" }
        };
        WinJS.UI.SettingsFlyout.populateSettings(e);
    }

    var searchPane = Windows.ApplicationModel.Search.SearchPane.getForCurrentView(); //onquerysubmitted, onquerychanged
    searchPane.addEventListener("querysubmitted", querySubmittedHandler);

    function querySubmittedHandler(e) {
        handleSearchEntry(e.queryText);
    }

    function handleSearchEntry(search) {
        WinJS.Navigation.navigate("/pages/collection/Collection.html", { title: "Search", type: "search", filter: search });
    }

    app.start();
})();
