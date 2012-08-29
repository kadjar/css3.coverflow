
(function () {
    "use strict";
    var appModel = Windows.ApplicationModel;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var viewModel = Get("Ratio.ViewModel");
    var renderers = Ratio.Renderers;

    var userScrollPosition = 0;
    var modernQuotationMark = "&#148;";
    var searchPageURI = "/pages/collection/Collection.html";

    ui.Pages.define("/pages/collection/collection.html", {
        unload: unload,
        lastSearch: "",

        itemInvoked: function (args) {
            args.detail.itemPromise.done(function itemInvoked(item) {
                // TODO: Navigate to the item that was invoked.
                // nav.navigate("/html/<yourpage>.html", {item: item.data});
            });
        },

        // This function populates a WinJS.Binding.List with search results for the
        // provided query.
        searchData: function (term) {
            var collectionListView = document.getElementById("collectionListView").winControl;
            var list = viewModel._searchProducts({ search_title: term });

            ui.setOptions(collectionListView, {
                itemDataSource: list.dataSource,
                itemTemplate: renderers.tileRenderer
            });

            return list;
        },

        // This function executes each step required to perform a search.
        handleQuery: function (element, args) {
            var originalResults;
            this.lastSearch = args.queryText;
            if (typeof args.filter === 'undefined') {
                this.searching = false;
            } else {
                this.searching = true;
                this.initializeLayout(element.querySelector(".collection-list-view").winControl, Windows.UI.ViewManagement.ApplicationView.value);
                originalResults = this.searchData(args.filter);
            }
        },

        // This function updates the ListView with new layouts
        initializeLayout: function (listView, viewState) {
            /// <param name="listView" value="WinJS.UI.ListView.prototype" />

            if (viewState === appViewState.snapped) {
                listView.layout = new ui.ListLayout();
                document.querySelector(".pagetitle").innerHTML = modernQuotationMark + toStaticHTML(this.lastSearch) + modernQuotationMark;
                document.querySelector(".pagesubtitle").innerHTML = "";
            } else {
                listView.layout = new ui.GridLayout();
                document.querySelector(".pagetitle").innerHTML = "Search";
                document.querySelector(".titlearea .pagesubtitle").innerHTML = "Results for " + modernQuotationMark + toStaticHTML(this.lastSearch) + modernQuotationMark;
            }
        },

        // This function colors the search term. Referenced in /pages/collection/searchResults.html
        // as part of the ListView item templates.
        markText: function (source, sourceProperties, dest, destProperties) {
            var text = source[sourceProperties[0]];
            var regex = new RegExp(this.lastSearch, "gi");
            dest[destProperties[0]] = text.replace(regex, "<mark>$&</mark>");
        },

        ready: function (element, options) {
            // page initialization
            var listView = element.querySelector(".collection-list-view").winControl;
            listView.oniteminvoked = this.itemInvoked;
            if (options.type === "queryubmitted") {
                this.handleQuery(element, { title: "Search", type: "search", filter: options.queryText });
            }
            else {
                this.handleQuery(element, options);
            }
            listView.element.focus();

            var pagetitle = element.querySelector(".pagetitle");
            var pagesubtitle = element.querySelector(".pagesubtitle");

            if (!this.searching) {
                initListView(options);
                //initListeners();
            }
            else {
                pagetitle.innerHTML = options.title;
                pagesubtitle.innerHTML = modernQuotationMark + options.filter + modernQuotationMark;
            }
        },

        updateLayout: function (element, viewState, lastViewState) {
            // handle screen orientation changes.
            initListView(options);
        }
    });

    function unload() {
        // unload page
    }

    function initListeners() {
        var searchPane = Windows.ApplicationModel.Search.SearchPane.getForCurrentView();
        searchPane.onquerychanged = queryChangedHandler;
        searchPane.onquerysubmitted = querySubmittedHandler;
    }

    function initListView(options) {
        if (options.type === "search" || options.type === "querysubmitted") {
           
        }
        else {
            var list = viewModel._getProductsByGroupTitle(options.home.title);
        }
       
        var alaphabeticList = document.getElementById("alaphabeticList").winControl;
        var collectionListView = document.getElementById("collectionListView").winControl;
        var semanticZoom = document.getElementById('semanticZoom').winControl;

        // this is the none snapped view
        semanticZoom.zoomedOut = false;
        semanticZoom.locked = false;

         ui.setOptions(collectionListView, {
            layout: {
                type: ui.GridLayout
            },
            itemDataSource: list.dataSource,
            itemTemplate: renderers.tileRenderer,
             oncontentanimating: function () {
                 collectionListView.recalculateItemPosition();
                 if (userScrollPosition)
                     collectionListView.scrollPosition = userScrollPosition;

                 setTimeout(function () {
                     document.getElementById('semanticZoom').className += ' in';
                 }, 300);
             }
         });
         ui.setOptions(alaphabeticList, {
             layout: {
                 type: ui.ListLayout
             },
             itemDataSource: list.groups.dataSource,
             itemTemplate: renderers.alphabeticRenderer
         });
    }

    //function queryChangedHandler(e) {
    //    updateStringSearch(e.queryText, 750); // use typical delay for keystrokes
    //}

    //function querySubmittedHandler(e) {
    //    updateStringSearch(e.queryText, 15); // user hits enter, no need for delay
    //}

    //function updateStringSearch(search, delay) {
    //    // quick fix to prevent this method from executing when invoked globally by search charm.
    //    // TODO: remove listeners like this when page is unloaded.
    //    var loc = WinJS.Navigation.location;
    //    if (loc.indexOf("Collection.html") == -1)
    //        return;

    //    if (search == lastSearch || (search == "" && lastSearch == ""))
    //        return;

    //    lastSearch = search;

    //    // timer.start(delay);
    //}

    appModel.Search.SearchPane.getForCurrentView().onquerysubmitted = function (args) { nav.navigate(searchPageURI, args); };

})();
