// Add - add an object and any child objects

var Ratio = Ratio || {};

Ratio.Add = function () {

    var Promise = Ratio.Promise;

    // === constructor and instance members ===

    var Add = function (orm) {
        if (!orm) throw new Error("Require orm property (ORM) in constructor");
        this.orm = orm;
    }

    // === prototype members ===
    Add.prototype.object = function (obj) {
        this._object = obj;
        return this;
    }

    Add.prototype.to = function (entityName) {
        this._entityName = entityName;
        return this;
    }

    Add.prototype.execute = function () {
        var promise = new Promise();

        this._object._entityName = this._entityName;

        var effectedEntities = [];
        var root = this._buildTree.call(this, this._object, effectedEntities);

        var transaction = this.orm.database.transaction(effectedEntities, "readwrite");
        transaction.onerror = function (e) {
            throw e;
        }
        transaction.onsuccess = function (e) {
            promise.resolve();
        }
        this._save(root, transaction);

        return promise;
    };

    Add.prototype._save = function (node, transaction) {

        var objectStore = transaction.objectStore(node.entityName);
        var request = objectStore.add(node.value);
        request.onsuccess = function (event) {

            for (var i = 0; i < node.children.length; i++) {
                var childNode = node.children[i];
                _save(childNode, transaction);
            }
        }
        request.onerror = function (e) {
            throw e;
        }
    };

    // _buildTree - recursive method that converts an obj into a tree of meta objects that can then be processed
    // and saved to different objectStores.
    Add.prototype._buildTree = function (obj, entities, fkPropName, pkValue) {

        var entityName = obj._entityName;
        if (!entityName) throw new Error("_entityName property not found on obj to save");
        delete obj._entityName; // remove this meta property so it doesnt go into the object store

        // ensure this object maps to an entity
        var config = this.orm.configs[entityName];
        if (!config) throw new Error(entityName + " not found in configs");

        // record affected entities for opening the read/write transaction
        if (entities.indexOf(entityName) == -1)
            entities.push(entityName);

        if (fkPropName && pkValue) // if there is a foreign key relationship with another entity, add that property to this object
            obj[fkPropName] = pkValue;

        // create the descriptive node to be used in the save transaction
        var node = { entityName: entityName, value: obj, config: config, children: [] };

        if (config.keyPath && !config.autoIncrement) { // if there is an inline key that isnt being auto generated, make a guid
            if (!obj[config.keyPath] || obj[config.keyPath] == "" || obj[config.keyPath] == null) // dont overwrite the value if its present
                obj[config.keyPath] = this._newGuid();
        }

        for (var p in config.properties) { // walk properties to see if any contains an object containing attribute(s)
            var propObj = config.properties[p];

            if (propObj != "" && !obj[p])// if so, make sure that property isnt already set (dont overwrite existing guid)
                obj[p] = this._newGuid();
        }

        // branch at this node for any child relationships
        var relationships = config.relationships;

        for (var p in relationships) { // relationship's keys are the primary entity's property names, so 'p' is like 'employees'
            var relationship = relationships[p]; // only branch on declared entity relationships

            var childObj = obj[p]; // get the fk obj, like 'employees'
            if (childObj) { // if the object for this relationship is null, skip it

                delete obj[p]; // prevent primary object from saving foreign node in its own object store

                if (!Array.isArray(childObj))
                    childObj = [childObj];

                for (var i = 0; i < childObj.length; i++) {

                    var childNode = _buildTree.call(this, childObj[i], entities, relationship.foreignKey, obj[relationship.primaryKey]);
                    if (childNode)
                        node.children.push(childNode);
                }
            }//end if childObj
        }//end for p in relationships

        return node;
    };

    Add.prototype._newGuid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = (c == 'x') ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    return Add;
}();