// Property - property holder for fluent/declarative style property definitions

var Ratio = Ratio || {};

Ratio.Property = function () {
    "use strict"

    // === constructor and instance members ===
    var Property = function () {
        if (!(this instanceof Property)) throw new Error("Property must be used with the 'new' operator");
    }

    // === prototype members ===
    Property.prototype.asIndex = function () {
        this._asIndex = true;
        return this;
    }

    Property.prototype.asKeyPath = function () {
        this._asKeyPath = true;
        return this;
    }

    Property.prototype.inLine = function (keyPath) {
        this._inLine = keyPath;
        return this;
    }

    Property.prototype.autoIncrement = function () {
        this._autoIncrement = true;
        return this;
    }

    Property.prototype.hasOne = function (entityName) {
        this._relation = "hasOne";
        this._entityName = entityName;
        return this;
    }

    Property.prototype.hasMany = function (entityName) {
        this._relation = "hasMany";
        this._entityName = entityName;
        return this;
    }

    Property.prototype.foreignKey = function (key) {
        this._foreignKey = key;
        return this;
    }

    Property.prototype.primaryKey = function (key) {
        this._primaryKey = key;
        return this;
    }


    // === static members ===

    Property.CREATE_DEPENDENCIES = "createDependencies";

    // convenience API so property definitions can begin "Property.asIndex()" rather than "new Property().asIndex()"
    Property.asIndex = function () {
        return new Property().asIndex();
    }
    Property.asKeyPath = function () {
        return new Property().asKeyPath();
    }
    Property.inLine = function (keyPath) {
        return new Property().inLine(keyPath);
    }
    Property.autoIncrement = function () {
        return new Property().autoIncrement();
    }
    Property.hasOne = function (entityName) {
        return new Property().hasOne(entityName);
    }
    Property.hasMany = function (entityName) {
        return new Property().hasMany(entityName);
    }
    Property.foreignKey = function (key) {
        return new Property.foreignKey(key);
    }
    Property.primaryKey = function (key) {
        return new Property.primaryKey(key);
    }

    return Property;
}();