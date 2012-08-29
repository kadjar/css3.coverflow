/* Join - query objects related to primary objects and set references to them on the primary objects
ex: var j = new Join(orm).some(ownerArr, "Owner").with("Pet").whereIndex("fk_petId").equals("petId").asProperty("pets");
    j.execute();
*/

var Ratio = Ratio || {};

Ratio.Join = function () {
    "use strict";

    var Query = Ratio.Query;

    // === constructor and instance members ===
    var Join = function (orm) {
        if (!(this instanceof Join)) throw new Error("Join must be used with the 'new' operator");
        if (!orm) throw new Error("Require orm property (ORM) in constructor");

        this.orm = orm;
    }

    // === prototype members ===
    Join.prototype.some = function (collection, entityName) {
        this.collection = collection;
        this.itemEntityName = entityName;
        return this;
    }

    Join.prototype.with = function (entityName) {
        this.entityName = entityName;
        return this;
    }

    Join.prototype.whereKeyPath = function (keyPath) {
        this.keyPath = keyPath;
        return this;
    }

    Join.prototype.whereIndex = function (index) {
        this.index = index;
        return this;
    }

    Join.prototype.equals = function (value) {
        this.value = value;
        return this;
    }

    Join.prototype.asProperty = function (value) {
        this.asProperty = value;
        return this;
    }

    Join.prototype.execute = function () {
        var self = this;
        this.promise = new Ratio.Promise("Join.execute");
        this.results = [];
        this.curr = 0;

        var then = function (result) {
            self.results.push(result);
            self.curr++;
            if (self.curr == self.collection.length)
                self.promise.resolve(self.results);
            else
                self.doQuery(self.curr, self.collection, self.asProperty, then);
        }

        if (self.collection.length)
            this.doQuery(this.curr, this.collection, this.asProperty, then);
        else
            console.warn("Join.execute: no items in collection to join on");

        return this.promise;
    }

    Join.prototype.doQuery = function (curr, collection, asProperty, callback) {
        var item = collection[curr];

        var q = new Query(this.orm).from(this.entityName).whereIndex(this.index).equals(item[this.value]);
        q.execute().then(function (result) {
            item[asProperty] = result[0];
            callback(item);
        });
    }

    // === static members ===

    return Join;
}();