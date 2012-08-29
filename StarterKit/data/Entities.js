// Definitions for IndexedDB entities and relationships
var Ratio = Ratio || {};

/* definition */
Ratio.Entities = function () {
    "use strict";

    var Property = Ratio.Property;

    var Entities = {};
    Entities.item = {
        id: Property.asKeyPath(), //integer primary key
        title: Property, // text
        isFavorite: Property, // bool
    }
    return Entities;
}();