/* namespace */
var Ratio = Ratio || {};

/* definition */
Ratio.ViewModel = function () {

    var Signal = Ratio.Signal;
    var Delegate = Ratio.Delegate;

    /* constructor */
    var ViewModel = function () {
        // public api
        this.signal = new Signal();

        // initialization
        this.defineGroups();
        this.defineItems();

        var groupDataSelector = function (item) {
            return item.group;
        }

        var groupKeySelector = function (item) {
            return item.group.key;
        }

        this.groups = [this.fruit, this.veg, this.candy, this.drink];

        //this._list = alphaSort(this.items);

        this._list = new WinJS.Binding.List(this.items);

        this.groupedItems = this._list.createGrouped(groupKeySelector, groupDataSelector);
        this.groupDataSource = this.groupedItems.groups;

        // get references to each group for use when getting random datasets
        this.fruitData = this._getProductsByKey(this.fruit.key);
        this.vegData = this._getProductsByKey(this.veg.key);
        this.candyData = this._getProductsByKey(this.candy.key);
        this.drinkData = this._getProductsByKey(this.drink.key);
        
    };

    /* prototype */

    /* getters/setters */
    ViewModel.prototype = {
        get todo() {
            return this._todo;
        }
    }

    /* public */
    
    ViewModel.prototype.getHomeData = function () {

        return this.groupedItems;
    }

    ViewModel.prototype._getProductsByKey = function (key) {
        var arr = this._list.filter(function (item) {
            return (item.group.key == key);
        });

        return arr;
    }

    ViewModel.prototype._getProductsByGroupTitle = function (title) {
        var group = this._list.filter(function (item) {
            return (item.group.title == title);
        });
        
        return new WinJS.Binding.List(group).createGrouped(collectionKeySelector, collectionDataSelector);
    }

    ViewModel.prototype._searchProducts = function (term) {
        var results = this._list.filter(function (item) {
            return (item.title === term.search_title);
        });
        return new WinJS.Binding.List(results);
    }

    var collectionKeySelector = function (item) {
        return item.title;
    }

    var collectionDataSelector = function (item) {
        return item;
    }

    ViewModel.prototype._getProductByTitle = function (title) {
        var detail = this._list.filter(function (item) {
            return (item.title == title);
        });
        return detail;
    }

    // === static members ===


    // define groupings and a large image for each in the zoomed out semantic view
    ViewModel.prototype.defineGroups = function () {
        this.fruit = { key: 'fruits', title: "Fruit", image: "http://placekitten.com/g/310/150" };
        this.veg = { key: 'veg', title: "Veg", image: "http://placekitten.com/g/310/150" };
        this.candy = { key: 'candy', title: "Candy", image: "http://placekitten.com/g/310/150" };
        this.drink = { key: 'drink', title: "Drink", image: "/assets/images/smalllogo.png" };
    }

    ViewModel.prototype.defineItems = function () {
        this.items = [
            { title: "basic banana", image: "http://placekitten.com/g/310/150", group: this.fruit, description: "A description of the item goes here!" },
            { title: "banana blast", image: "http://placekitten.com/g/310/150", group: this.fruit, description: "A description of the item goes here!" },
            { title: "brilliant banana", image: "http://placekitten.com/g/310/150", group: this.fruit, description: "A description of the item goes here!" },
            { title: "Lettuce", image: "http://placekitten.com/g/310/150", group: this.veg, description: "A description of the item goes here!" },
            { title: "Carrot", image: "http://placekitten.com/g/310/150", group: this.veg, description: "A description of the item goes here!" },
            { title: "Broccoli", image: "http://placekitten.com/g/310/150", group: this.veg, description: "A description of the item goes here!" },
            { title: "milkyway", image: "http://placekitten.com/g/310/150", group: this.candy, description: "A description of the item goes here!" },
            { title: "skittles", image: "http://placekitten.com/g/310/150", group: this.candy, description: "A description of the item goes here!" },
            { title: "jujubees", image: "http://placekitten.com/g/310/150", group: this.candy, description: "A description of the item goes here!" },
            { title: "coke", image: "http://placekitten.com/g/310/150", group: this.drink, description: "A description of the item goes here!" },
            { title: "ipa", image: "http://placekitten.com/g/310/150", group: this.drink, description: "A description of the item goes here!" },
            { title: "water", image: "/assets/images/widelogo.png", group: this.drink, description: "A description of the item goes here!" }
        ];
    }

    /* statics */
    ViewModel.TODO = "todo";

    /* exports */
    return ViewModel;
}();