// Select - uses a collection of ids to retrieve corresponding objects from ORM

var Ratio = Ratio || {};

Ratio.Select = function () {
    "use strict";

    var Query = Ratio.Query;

    // === constructor and instance members ===
    var Select = function (orm) {
        if (!(this instanceof Select)) throw new Error("Select must be used with the 'new' operator");
        if (!orm) throw new Error("Require orm property (ORM) in constructor");

        this.orm = orm;
    }

    // === prototype members ===
    Select.prototype.some = function (entityName) {
        this.entityName = entityName;
        return this;
    }

    Select.prototype.byKeyPath = function (keyPath) {
        this.keyPath = keyPath;
        return this;
    }

    Select.prototype.byIndex = function (index) {
        this.index = index;
        return this;
    }

    Select.prototype.in = function (collection) {
        this.collection = collection;
        return this;
    }

    Select.prototype.execute = function (option, dependencies) {
        var self = this;
        this.promise = new Ratio.Promise("Select.execute");
        this.results = [];
        this.curr = 0;
        this.option = option; // whether or not to get dependencies
        this.dependencies = dependencies; // which dependencies to get

        if (this.collection.length)
            this.doQuery(this.curr, this.collection, this.option, this.dependencies);
        else
            setTimeout(function () { self.promise.resolve([]) }, 50);

        return this.promise;
    }

    Select.prototype.doQuery = function (curr, collection, option, dependencies) {
        var self = this;
        var item = collection[curr];

        // todo: support 'whereIndex' as well
        var q = new Query(this.orm).from(this.entityName).whereKeyPath(this.keyPath).equals(item);
        q.execute(this.option, this.dependencies).then(function (results) {
            var result = results[0]; // temporary: only taking the first result because we coded for retrieval by unique key
            result && self.results.push(result); // todo: consider self.results.concat(results) to handle multiple query results
            self.curr++;
            if (self.curr == self.collection.length)
                self.promise.resolve(self.results);
            else
                self.doQuery(self.curr, self.collection, self.collection, self.dependencies);
        });
    }

    // === static members ===

    return Select;
}();