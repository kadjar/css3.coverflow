/* file access wrapper for winrt */

/* namespace */
var Ratio = Ratio || {};

/* definition */
Ratio.FileService = (function () {
    "use strict";

    var Promise = Ratio.Promise;

    /* constructor */
    var FileService = function () {

    };

    /* statics */
    FileService.getFileFromAppFolder = function (relativePath) {
        var promise = new Promise("FileService.getFileFromAppFolder");

        WinJS.xhr({ url: "ms-appx:///" + relativePath }).then(function (request) {
            var result = request.responseText;
            promise.resolve(result);
        }, function (e) { promise.error(e) });

        return promise;
    };


    FileService.getFileFromLocalFolder = function (relativePath) {
        var promise = new Promise("FileService.getFileFromLocalFolder");

        Windows.Storage.ApplicationData.current.localFolder.getFileAsync(relativePath).then(function (file) {
            handleFileLoad(promise, file);
        });

        return promise;
    };

    FileService.getFileFromDocumentsLibrary = function (relativePath) {
        var promise = new Promise("FileService.getFileFromDocumentsLibrary");

        Windows.Storage.KnownFolders.documentsLibrary.getFileAsync(relativePath).then(function (file) {
            handleFileLoad(promise, file);
        });

        return promise;
    };

    FileService.readFile = function(storageFile) {
        var promise = new Promise();
        handleFileLoad(promise, storageFile);
        return promise;
    };

    function handleFileLoad(promise, file) {
        if (file.displayName == null)
            promise.error({ message: "failed to find file", data: null });

        file.openAsync(Windows.Storage.FileAccessMode.read).then(function (stream) {

            var inputStream = stream.getInputStreamAt(0);
            var reader = new Windows.Storage.Streams.DataReader(inputStream);

            var size = stream.size;
            if (size > 0) {
                reader.loadAsync(size).then(function () {
                    var fileContents = reader.readString(size);
                    promise.resolve(fileContents);
                });
            }
            else {
                promise.error({ message: "file was empty", data: null });
            }
        });
    }

    return FileService;
})();