/* abstraction for persistence */

/* namespace */
var Ratio = Ratio || {};

/* definition */
Ratio.Repository = function () {
    "use strict";

    /* constructor */
    var Repository = function () {

    };


    /* prototype */

    /* public */
    Repository.prototype.initialize = function (idbOrm) {
        this._idbOrm = idbOrm;
    };

    Repository.prototype.isFavorite = function (item) {
        var promise = Get("Ratio.Promise");

        this._idbOrm.item.get(item.id).then(function (obj) {
            promise.resolve(obj && obj.isFavorite || false);
        }).fail(function () {
            promise.resolve(false);
        });
        return promise;
    }

    Repository.prototype.setFavorite = function (item, isFavorite) {
        this._idbOrm.item.get(item.id).then(function (obj) {
            obj.isFavorite = isFavorite;
            this._idbOrm.item.put(obj);
        });
    }

    
    /* statics */

    return Repository;
}();