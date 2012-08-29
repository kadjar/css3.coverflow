// IdbOrm - facade for interacting with ORM and using ORM commands

var Ratio = Ratio || {};

Ratio.IdbOrm = (function () {
    "use strict"

    var ORM = Ratio.ORM;
    var Add = Ratio.Add;
    var Query = Ratio.Query;
    var Delete = Ratio.Delete;
    var Select = Ratio.Select;
    var Promise = Ratio.Promise;

// === constructor and instance members ===
    function IdbOrm(dbName) {
        if (!(this instanceof IdbOrm)) throw new Error("IdbOrm must be used with the 'new' operator");
        if (!dbName) throw new Error("Require dbName property in constructor");

        this.orm = new ORM(dbName);

        this.onReady = this.orm.onReady;
        this.onUpgrade = this.orm.onUpgrade;
        this.onError = this.orm.onError;
        this.onDelete = this.orm.onDelete;
    }

    // === prototype members ===
    IdbOrm.prototype.initialize = function (entities) {
        generateConvenienceAPI(this, entities);
        this.orm.initialize(entities);
    };

    IdbOrm.prototype.deleteDatabase = function () {
        this.orm.deleteDatabase();
    };

    IdbOrm.prototype.query = function () {
        return new Query(this.orm);
    };

    IdbOrm.prototype.add = function (obj) {
        return new Add(this.orm).object(obj);
    };

    IdbOrm.prototype.delete = function (obj) {
        return new Delete(this.orm);
    };


    // todo: this does not belong here.
    IdbOrm.prototype.newEntity = function (entityName, entityOptions) {
        if (!entityName) throw new Error("Require entityName property in constructor");

        var config = this.configs[entityName];
        if (!config) throw new Error(entityName + " not found in configs");

        var createDependentObjects = (entityOptions && entityOptions == EntityProperty.CREATE_DEPENDENCIES) || false;

        var obj = { _entityName: entityName };
        for (var property in config.properties) {

            var relationship = config.relationships[property];

            if (createDependentObjects && relationship) {
                if (relationship.relation == "hasOne") // create an empty object with all the properties
                    obj[property] = this.newEntity(relationship.fkEntity, EntityProperty.CREATE_DEPENDENCIES);

                if (relationship.relation == "hasMany")// create an empty array to hold multiple entities
                    obj[property] = [];
            }
            else if (property != config.keyPath)
                obj[property] = null;
        }

        return obj;
    };

    // === static members ===
    function generateConvenienceAPI(idbOrm, entities) {

        for (var entity in entities) {
            // add the entity name as an object to hold list, get, add, put and delete methods
            idbOrm[entity] = {};
            // generate APIs for each entity
            idbOrm[entity].list = generateList(idbOrm, entity);
            idbOrm[entity].get = generateGet(idbOrm, entity);
            idbOrm[entity].add = generateAdd(idbOrm, entity);
            idbOrm[entity].put = generatePut(idbOrm, entity)
            idbOrm[entity].delete = generateDelete(idbOrm, entity);
            idbOrm[entity].getRelated = generateGetRelated(idbOrm, entity);
            idbOrm[entity].getMany = generateGetMany(idbOrm, entity);
        }
    }

    function generateList(idbOrm, entity) {
        return function (max, skip) {
            var promise = new Promise();

            var transaction = idbOrm.orm.database.transaction([entity], "readonly");
            var objectStore = transaction.objectStore(entity);
            var request = objectStore.openCursor();
            
            max = max || Infinity; // if no max value was set, get ALL records
            var results = [];
            var count = 0;
            
            request.onsuccess = function (event) {
                var cursor = event.target.result;
                
                if (cursor && skip) { // advance the cursor if a skip value is defined
                    cursor.advance(skip);
                    skip = undefined; // unset this value so advance only occurs once
                    return;
                }

                if (cursor) {
                    results.push(cursor.value);

                    if(++count < max) // stop when enough data has been retrieved
                        cursor.continue();
                    else
                        promise.resolve(results);
                }
                else {
                    promise.resolve(results);
                }
            };
            request.onerror = function (event) {
                promise.fail(event);
            };

            return promise;
        };
    }

    function generateGet(idbOrm, entity) {
        return function (keyPath, options) {
            var promise = new Promise();

            var transaction = idbOrm.orm.database.transaction([entity], "readonly");
            var objectStore = transaction.objectStore(entity);
            var request = objectStore.get(keyPath);
            request.onsuccess = function (event) {
                promise.resolve(request.result);
            };
            request.onerror = function (event) {
                promise.fail(event);
            };

            return promise;
        };
    }

    function generateAdd(idbOrm, entity) {
        return function (object) {
            var promise = new Promise();

            object.__entity = entity;
            var transaction = idbOrm.orm.database.transaction([entity], "readwrite");
            var objectStore = transaction.objectStore(entity);
            var request = objectStore.add(object);

            request.onsuccess = function (event) {
                promise.resolve(request.result);
            };
            request.onerror = function (event) {
                // todo: useful message for CONSTRAINT_ERR (adding an object that is already stored)
                promise.fail(event);
            };

            return promise;
        };
    }

    function generatePut(idbOrm, entity) {
        return function (object) {
            var promise = new Promise();

            object.__entity = entity;
            var transaction = idbOrm.orm.database.transaction([entity], "readwrite");
            var objectStore = transaction.objectStore(entity);
            var request = objectStore.put(object);
            request.onsuccess = function (event) {
                promise.resolve(request.result);
            };
            request.onerror = function (event) {
                promise.fail(event);
            };

            return promise;
        };
    }

    function generateDelete(idbOrm, entity) {
        return function (keyPath) {
            var promise = new Promise();

            var transaction = idbOrm.orm.database.transaction([entity], "readwrite");
            var objectStore = transaction.objectStore(entity);
            var request = objectStore.delete (keyPath);
            request.onsuccess = function (event) {
                promise.resolve(request.result);
            };
            request.onerror = function (event) {
                promise.fail(event);
            };

            return promise;
        };
    }

    function generateGetRelated(idbOrm, entity) {
        return function (object, options) {

            var promise = new Promise();
            promise.nestCount = 0;
            var deep = (typeof (options) == "boolean") ? options : false;
            var config = idbOrm.orm.configs[entity];

            for (var property in config.relationships) {
                // an array can specify what dependencies to get, so skip omitted dependencies, if 'options' is an array
                if (Array.isArray(options) && options.indexOf(property) == -1)
                    continue;

                var relationship = config.relationships[property];
                idbOrm.orm._getRelatedObjects(object, property, relationship, promise, deep);
            }

            return promise;
        };
    }

    function generateGetMany(idbOrm, entity) {
        return function (keyPathArray, options) {
            var config = idbOrm.orm.configs[entity];
            var cmd = new Select(idbOrm.orm).some(entity).byKeyPath(config.keyPath).in(keyPathArray);
            if (options)
                return cmd.execute(Query.GET_DEPENDENCIES, options);
            else
                return cmd.execute();
        };
    }

    return IdbOrm;
})();