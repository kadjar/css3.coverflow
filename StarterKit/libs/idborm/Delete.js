// Delete - delete an object and any child objects

var Ratio = Ratio || {};

Ratio.Delete = function () {

    var Promise = Ratio.Promise;

    // === constructor and instance members ===

    var Delete = function (orm) {
        if (!orm) throw new Error("Require orm property (ORM) in constructor");
        this.orm = orm;
    }

    // === prototype members ===
    Delete.prototype.from = function (entityName) {
        this._entityName = entityName;
        return this;
    }

    Delete.prototype.whereKeyPath = function (keyPath) {
        this._keyPath = keyPath;
        return this;
    }

    Delete.prototype.whereKeyPathEquals = function (value) {
        this._value = value;
        return this;
    }

    Delete.prototype.execute = function () {
        var promise = new Promise();

        var transaction = this.orm.database.transaction([this._entityName], "readwrite");
        transaction.onerror = function (e) {
            throw e;
        };
        var objectStore = transaction.objectStore(this._entityName);
        var request = objectStore.delete (this._value);
        request.onsuccess = function () {
            promise.resolve();
        }
        return promise;
    };

    return Delete;
}();