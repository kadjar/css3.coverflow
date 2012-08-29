// logging utility output debug messages or append messages to a file in the application folder. 
// TODO: integrate with diagnostic event tracing when possible

Log = function () { // this is intentionally global
    "use strict";

    var INFO = "info", WARN = "warn", ERROR = "error", CRITICAL = "critical";

    var Log = function (message) {
        Log._append(message, INFO);
    };

    Log.info = function (message) {
        Log._append(message, INFO);
    };

    Log.warn = function (message) {
        Log._append(message, WARN);
    };

    Log.error = function (message) {
        Log._append(message, ERROR);
    };

    Log.critical = function (message) {
        Log._append(message, CRITICAL);
    };


    Log.toConsole = function () {
        Log._append = function (message, level) {
            switch (level) {
                case INFO:
                    console.info(message);
                    break;
                case WARN:
                    console.warn(message);
                    break;
                case ERROR:
                    console.error(message);
                    break;
                case CRITICAL:
                    console.error("<critical> " + message); // console does not have 'critical'
                    break;
            }
        };
    }


    var LOG_FILE_NAME = "Ratio.log";
    var logFile;

    Log.toFile = function () {
        var FileIO = Windows.Storage.FileIO;

        Windows.Storage.ApplicationData.current.localFolder.createFileAsync(LOG_FILE_NAME, Windows.Storage.CreationCollisionOption.replaceExisting).then(function (file) {
            logFile = file;
        });

        Log._append = function (message, level) {
            FileIO.appendTextAsync(logFile, level + ": " + message + "\n");
        };
    }


    var LOGGING_URL = "http://127.0.0.1";

    Log.toRemote = function () {
        WinJS.xhr({ url: LOGGING_URL }).then(function (response) {
            
        }, function (response) {
            // do nothing on failure
        });
    }

    /* set the default Log._append strategy to console output */
    Log.toConsole();


    return Log;
}();