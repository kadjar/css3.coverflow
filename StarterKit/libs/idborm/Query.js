// Query - operates on an IdbOrm to retrieve objects and related objects

var Ratio = Ratio || {};

Ratio.Query = function () {
    "use strict";

    // === constructor and instance members ===
    var Query = function (orm) {
        if (!(this instanceof Query)) throw new Error("Query must be used with the 'new' operator");
        if (!orm) throw new Error("Require orm property (ORM) in constructor");

        this.orm = orm;
        this.nestCount = 0; // counts recursion levels so query knows when to resolve promise
    }

    // === prototype members ===
    Query.prototype.from = function (entityName) {
        this.entityName = entityName;
        return this;
    }

    Query.prototype.whereKeyPath = function (keyPath) {
        this.keyPath = keyPath;
        return this;
    }

    Query.prototype.whereIndex = function (index) {
        this.index = index;
        return this;
    }

    Query.prototype.equals = function (value) {
        this.value = value;
        return this;
    }

    Query.prototype.isAbove = function (value) {
        this.above = value;
        return this;
    }

    Query.prototype.isBelow = function (value) {
        this.below = value;
        return this;
    }

    Query.prototype.execute = function (option, dependencies) {
        var self = this;
        this.promise = new Ratio.Promise("Query.execute");
        this.result = [];
        this.getDependencies = (option && option == Query.GET_DEPENDENCIES);
        this.getSomeDependencies = (dependencies && Array.isArray(dependencies));
        this.proxyDependencies = (option && option == Query.PROXY_DEPENDENCIES);

        this.dependencies = dependencies;

        if (!this.orm.database.objectStoreNames.contains(this.entityName))
            throw new Error("Trying to query objectStore '" + this.entityName + "' but the objectStore does not exist");

        var transaction = this.orm.database.transaction(this.entityName, "readonly");
        var objectStore = transaction.objectStore(this.entityName);

        // determine the range of the request
        var range;
        if (this.above !== undefined || this.below !== undefined) {
            if (this.above !== undefined && this.below !== undefined) {
                range = IDBKeyRange.bound(this.above, this.below);
            }
            else {
                if (this.above !== undefined)
                    range = IDBKeyRange.lowerBound(this.above);

                if (this.below !== undefined)
                    range = IDBKeyRange.upperBound(this.below);
            }
        }
        else
            range = IDBKeyRange.only(this.value);

        // begin the request
        var request;

        var config = self.orm.configs[this.entityName];

        if (this.index) {
            if (config.indices.indexOf(this.index) == -1)
                throw new Error("Trying to query '" + this.entityName + "' objectStore by undeclared index '" + this.index + "'")

            var index = objectStore.index(this.index);
            request = index.openCursor(range);
        }

        if (this.keyPath) {
            if (this.keyPath != config.keyPath)
                throw new Error("Trying to query '" + this.entityName + "' objectStore by undeclared keyPath '" + this.keyPath + "'")
            request = objectStore.openCursor(range);
        }

        this.nestCount++;

        // when complete, begin requests for related objects
        request.onsuccess = function (event) {

            var cursor = event.target.result;
            if (cursor) {
                var obj = cursor.value;
                if (self.getDependencies) {
                    var config = self.orm.configs[self.entityName];

                    for (var dependency in config.relationships) {
                        // if we are only getting some dependencies, exit if the dependency isnt found in the list
                        if (self.getSomeDependencies && self.dependencies.indexOf(dependency) == -1)
                            continue;

                        var relationship = config.relationships[dependency];
                        self._getRelatedObjects(cursor.value, dependency, relationship);
                    }
                }

                if (self.proxyDependencies) { // todo - figure out to how resolve nestCount when this occurs out of pocket
                    var config = self.orm.configs[self.entityName];

                    for (var dependency in config.relationships) {
                        var relationship = config.relationships[dependency];

                        obj[dependency] = function (obj, property, relationship) {
                            return function () {
                                self._getRelatedObjects(obj, property, relationship);
                            };
                        }(obj, dependency, relationship);
                    }
                }

                self.result.push(cursor.value);
                cursor.continue();
            }
            else {
                self.nestCount--;
                if (self.nestCount == 0)
                    self.promise.resolve(self.result);
            }
        };
        request.onerror = function (event) {
            self.promise.error(event);
        }

        return this.promise;
    }


    Query.prototype._getRelatedObjects = function (obj, property, relationship) {

        var self = this;
        var rel = relationship; // hold onto objects config so onsuccess can get dependent relationships by entity name
        this.nestCount++;

        if (relationship.relation == "hasMany")
            obj[property] = [];

        var transaction = this.orm.database.transaction(relationship.fkEntity, "readonly");
        var objectStore = transaction.objectStore(relationship.fkEntity);
        var index = objectStore.index(relationship.foreignKey);
        var range = obj[relationship.primaryKey];
        var request = index.openCursor(IDBKeyRange.only(range));
        request.onsuccess = function (event) {

            var cursor = event.target.result;
            if (cursor) {
                if (Array.isArray(obj[property])) // if this property is an array, push
                    obj[property].push(cursor.value);
                else
                    obj[property] = cursor.value;


                var config = self.orm.configs[rel.fkEntity];

                for (var p in config.relationships) {
                    var relationship = config.relationships[p];
                    self._getRelatedObjects(cursor.value, p, relationship);
                }

                cursor.continue();
            }
            else {
                self.nestCount--;
                if (self.nestCount == 0)
                    self.promise.resolve(self.result);
            }
        };

    }


    // === static members ===

    Query.GET_DEPENDENCIES = "getDependencies";
    Query.PROXY_DEPENDENCIES = "proxyDependencies";

    return Query;
}();