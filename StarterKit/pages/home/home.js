(function () {
    "use strict";

    var userScrollPosition = 0;

    WinJS.UI.Pages.define("/pages/home/home.html", { ready: ready, unload: unload, updateLayout: updateLayout });

    function ready(element, options) {
        // page initialization
        init();
        //initListView();
        coverflow.init();
    }

    function unload() {
        // unload page
    }

    function updateLayout(element, viewState, lastViewState) {
        // handle screen orientation changes.
        //initListView();
    }

    function init() {
        WinJS.Navigation.history.backStack = [];
        Get("AppBar").updateState("home");
    }

    function initListView() {
        var viewModel = Get("Ratio.ViewModel");
        var list = viewModel.getHomeData();
        
        //var collectionList = document.getElementById("collectionList").winControl;
        //var homeListView = document.getElementById("homeListView").winControl;
        var semanticZoom = document.getElementById('semanticZoom').winControl;

        // this is the none snapped view
        semanticZoom.zoomedOut = false;
        semanticZoom.locked = false;

        WinJS.UI.setOptions(homeListView, {
            layout: {
                type: WinJS.UI.GridLayout,
                groupInfo: {
                    enableCellSpanning: true,
                    cellWidth: 350,
                    cellHeight: 175
                }
            },
            itemDataSource: list.dataSource,
            itemTemplate: Ratio.Renderers.tileRenderer,
            groupDataSource: list.groups.dataSource,
            groupHeaderTemplate: Ratio.Renderers.headerRenderer,
            oncontentanimating: function () {
                homeListView.recalculateItemPosition();
                if (userScrollPosition)
                    homeListView.scrollPosition = userScrollPosition;

                //document.getElementById('loading-grid').className += ' out';
                setTimeout(function () {
                    document.getElementById('semanticZoom').className += ' in';
                }, 300);
            }
        });
        WinJS.UI.setOptions(collectionList, {
            layout: {
                type: WinJS.UI.GridLayout
            },
            itemDataSource: list.groups.dataSource,
            itemTemplate: Ratio.Renderers.collectionRenderer
        });
    }

})();
