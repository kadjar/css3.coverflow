/** Combined ServiceLocator and generic factory for marshaling object creation and referencing throughout an app */

/* definition */
var Get = function () {

    var resourceMap = {}; // dictionary used to map qualified classnames to instances or constructor functions

    /* constructor */

    /** Pass an id or qualified class name in to get an object instance */
    var Get = function (resourceId) {
        var instance = resourceMap[resourceId];

        if (instance)
            return instance();

        throw new Error("No mapping for '" + resourceId + "'");
    };

    /* statics */
    Get.map = function (resourceId, resource, asSingleton) {
        if (typeof (resource) === "function") { // assume a constructor function has been passed in
            Get.mapConstructor(resourceId, resource, asSingleton);
            return;
        }
        
        // an actual instance has been passed in, return it each time
        Get.mapInstance(resourceId, resource);
    };

    /* an instance has been passed in, return it each time */
    Get.mapInstance = function (resourceId, resource) {

        resourceMap[resourceId] = function () {
            return resource;
        };

        generateConvenienceAPI(Get, resourceId, resourceMap[resourceId]);
    };

    Get.mapConstructor = function (resourceId, resource, asSingleton) {
        if (asSingleton) {
            Get.mapSingleton(resourceId, resource);
            return;
        }

        // create a new instance every time
        resourceMap[resourceId] = function () {
            return new resource();
        };

        generateConvenienceAPI(Get, resourceId, resourceMap[resourceId]);
    };

    /* on first call, create the instance and redefine the method to return that instance on subsequent calls */
    Get.mapSingleton = function (resourceId, resource) {

        resourceMap[resourceId] = function () {
            var res = new resource();
            resourceMap[resourceId] = function () {
                return res;
            };

            generateConvenienceAPI(Get, resourceId, resourceMap[resourceId]);

            return res;
        };

        generateConvenienceAPI(Get, resourceId, resourceMap[resourceId]);
    };

    /* return a reference to the object with static properties */
    Get.mapStatic = function (resourceId, resource) {
        
        resourceMap[resourceId] = function () {
            return resource;
        };

        generateConvenienceAPI(Get, resourceId, resource);
    };

    /* Add the resourceId namespace as an object chain on Get */
    function generateConvenienceAPI(obj, namespace, resource) {
        var parts = namespace.split('.');
        
        for (i = 0; i < parts.length; i++) {
            var part = parts[i];

            if (typeof obj[part] == 'undefined')
                obj[part] = {};

            if (i == parts.length - 1)
                obj[part] = resource;

            obj = obj[part];
        }

        obj = resource;
    }

    return Get;
}();