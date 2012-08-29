// ORM - abstraction layer above indexedDB that holds metadata about ObjectStores and relationships

var Ratio = Ratio || {};

Ratio.ORM = function () {
    "use strict";

    var Signal = Ratio.Signal;

    var ORM = function(dbName) {
        if (!(this instanceof ORM)) throw new Error("ORM must be used with the 'new' operator");
        if (!dbName) throw new Error("Require dbName property in constructor");

        this.dbName = dbName;

        this.entities = null;
        this.configs = null;
        this.database = null;

        this.onReady = new Signal();
        this.onUpgrade = new Signal();
        this.onError = new Signal();
        this.onDelete = new Signal();

        this._isUpgrading = false;
    }

    // === prototype members ===

    ORM.prototype.initialize = function (entities) {

        // use the entity object property name for the objectStore name (var Entities = { objectStore1:"" })
        this.entities = [];
        for (var p in entities) { // where p is like 'objectStore1'
            entities[p]._entityName = p; // add the name as a special property to the entity config
            this.entities.push(entities[p]); // save
        }

        // map all relationships between entities
        this._processEntityProperties();

        // connect to the db and/or create the required objectStores and indices
        this._connectDatabase();
    };


    ORM.prototype._connectDatabase = function () {
        var self = this;

        // use IndexedDatabaseFactory to open an IndexedDatabase
        this.dbReq = window.msIndexedDB.open(this.dbName);

        // if no upgrade is needed (not first connection), this will fire as soon as the db is connected
        this.dbReq.onsuccess = function (e) {
            self.database = e.target.result;
            if (!self._isUpgrading) // postpone notifying onReady so upgrade transaction can complete
                self.onReady.dispatch("database connected " + self.database.name);
        }

        // if this is the first time connecting or the version has changed, handle the upgrade workflow
        this.dbReq.onupgradeneeded = function (e) {
            self._isUpgrading = true;

            self.database = e.target.result; // set our reference to the database

            var transaction = self.dbReq.transaction;
            transaction.oncomplete = function (e) { // wait for completion of the new schema
                //self.onReady.dispatch("database connected " + self.database.name);
                var postponeReady = self.onUpgrade.dispatch(transaction, "upgrading database from version " + e.oldVersion + " to " + e.newVersion);
            }

            // actually initialize the objectStores
            self._createObjectStores.call(self, self.dbReq.transaction);
            
            //var postponeReady = self.onUpgrade.dispatch(transaction, "upgrading database from version " + e.oldVersion + " to " + e.newVersion);
        }

        this.dbReq.onerror = function (e) {
            self.onError.dispatch("could not open " + self.db.name);
        }

        return;
    };

    ORM.prototype.deleteDatabase = function () {
        var self = this;
        
        this.dbDelReq = window.msIndexedDB.deleteDatabase(this.dbName);

        this.dbDelReq.onsuccess = function (e) {
            self.onDelete.dispatch("database " + self.dbName + " deleted", e);
        }

        this.dbDelReq.onerror = function (e) {
            self.onError.dispatch("failed to delete database " + self.dbName);
        }
    }

    // run through all the entity objects and collate their relationships
    ORM.prototype._processEntityProperties = function () {

        var self = this;
        self.configs = {};
        for (var i = 0; i < self.entities.length; i++) {

            var entity = self.entities[i];
            var entityName = entity._entityName;
            delete entity._entityName; // remove this special prop so it doesnt get iterated over

            var config = self._getConfig(entityName);

            for (var p in entity) {
                var prop = entity[p];

                // check for the _keyPath meta property
                if (p == "_keyPath") {
                    if (prop._inLine)
                        config.keyPath = prop._inLine;

                    if (prop._autoIncrement)
                        config.autoIncrement = true;

                    delete entity[p];
                    continue;
                }

                if (!config.properties[p]) { // add this property to the config, ensure no duplicates
                    config.properties[p] = "";
                    config.propertyList.push(p);
                }

                if (prop instanceof Function) // if the prop just references the Property constructor, skip it
                    continue;

                if (prop._asIndex) { // make this property indexable in the datastore
                    if (config.indices.indexOf(p) == -1) // ensure no duplicates
                        config.indices.push(p);
                    continue;
                }

                if (prop._asKeyPath) { // make this property the items keyPath
                    config.keyPath = p;
                    config.autoIncrement = (prop._autoIncrement == true);
                    continue;
                }

                if (prop._relation) { // find any foreign key relationships

                    var fk = "fk_" + entityName.toLowerCase(); // start off with default pk and fk fields
                    var pk = "pk_id";

                    if (prop._primaryKey || prop._foreignKey) { // if define the relationship by supplied primary and foreign keys
                        // both must be defined, so throw if one isnt
                        if (!prop._primaryKey) throw new Error("must define foreign key if defining primary key");
                        if (!prop._foreignKey) throw new Error("must define primary key if defining foreign key");

                        pk = prop._primaryKey; // overwrite default generated properties
                        fk = prop._foreignKey;
                    }
                    else { // this attribute causes automatic generation and mapping of pk and fk with a guid
                        config.properties[pk] = { generateGuid: "" };
                    }

                    var relationship = { pkEntity: entityName, primaryKey: pk, relation: prop._relation, fkEntity: prop._entityName, foreignKey: fk };
                    config.relationships[p] = relationship;

                    // make sure foreign keys on entities are indexed by that key
                    var foreignConfig = self._getConfig(prop._entityName);
                    if (foreignConfig.indices.indexOf(fk) == -1) // ensure no duplicates indices on foreignConfig
                        foreignConfig.indices.push(fk);
                }
            } // end  p in entity
        } // end  i in entities
        return;
    };


    // use configs to setup object stores
    ORM.prototype._createObjectStores = function (transaction) {

        for (var p in this.configs) {
            var config = this.configs[p];

            if (transaction.db.objectStoreNames.contains(p)) // remove this object store if it's already defined, overwriting
                transaction.db.deleteObjectStore(p);

            var options = { autoIncrement: config.autoIncrement };
            if (config.keyPath)
                options.keyPath = config.keyPath;

            var store = transaction.db.createObjectStore(p, options);

            // create any defined indices or indices corresponding to foriegn key relationships
            for (var i = 0; i < config.indices.length; i++) {
                var indexName = config.indices[i];
                store.createIndex(indexName, indexName, { unique: false });
            }
        }
    };

    // get a config by name or initialize it
    ORM.prototype._getConfig = function (entityName) {

        var config = this.configs[entityName];

        if (!config)
            config = this.configs[entityName] = { properties: {}, propertyList: [], relationships: {}, indices: [], autoIncrement: false };

        return config;
    };

    // get related objects for a specific relationship
    ORM.prototype._getRelatedObjects = function (obj, property, relationship, promise, deep) {

        var self = this;
        var rel = relationship;
        promise.nestCount++;

        if (relationship.relation == "hasMany")
            obj[property] = [];

        var transaction = this.database.transaction(relationship.fkEntity, "readonly");
        var objectStore = transaction.objectStore(relationship.fkEntity);
        var index = objectStore.index(relationship.foreignKey);
        var key = obj[relationship.primaryKey];
        var request = index.openCursor(IDBKeyRange.only(key));

        request.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                if (Array.isArray(obj[property])) // if this property is an array, push
                    obj[property].push(cursor.value);
                else
                    obj[property] = cursor.value;

                if (deep) { // recursively get all related objects
                    var config = self.configs[rel.fkEntity];

                    for (var p in config.relationships) {
                        var relationship = config.relationships[p];
                        self._getRelatedObjects(cursor.value, p, relationship, promise, true);
                    }
                }
                cursor.continue();
            }
            else {
                if (--promise.nestCount == 0)
                    promise.resolve(obj);
            }
        };
        request.onerror = function (event) {
            if (--promise.nestCount == 0)
                promise.resolve(obj);
        };

    }

    return ORM;
}();