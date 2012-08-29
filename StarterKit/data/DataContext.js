// Facade for logic layer interacting with the data layer

/* namespace */
var Ratio = Ratio || {};

/* definition */
Ratio.DataContext = function () {
    "use strict";

    /* imports */
    var IdbOrm = Ratio.IdbOrm;
    var Delegate = Ratio.Delegate;
    var Task = Ratio.Task;


    /* constructor */
    function DataContext() {
        this.onReady = Get.Ratio.Signal();
        this.onError = Get.Ratio.Signal();
    };


    /* prototype */

    /* set up initialization tasks as a graph of dependencies */
    DataContext.prototype.initialize = function () {
        Log("DataContext.initialize");
        var startTask = new Task();
        var repositoryTask = this.buildRepositoryTask();
        var webServiceTask = this.buildWebServiceTask();
        var dataServiceTask = this.buildDataServiceTask();

        var endTask = new Task();
        endTask.work = Delegate(this, function () {
            this.onReady.dispatch();
        });

        Task.join(startTask, repositoryTask);
        Task.join(startTask, webServiceTask);
        Task.join(repositoryTask, dataServiceTask);
        Task.join(webServiceTask, dataServiceTask);
        Task.join(dataServiceTask, endTask);

        startTask.execute();
        startTask.next();
    }

    /* initialize database or pull content for first run */
    DataContext.prototype.buildRepositoryTask = function () {
        var repositoryTask = new Task();
        repositoryTask.work = Delegate(this, function () {
            
            this.idbOrm = new IdbOrm("RatioDB");

            this.idbOrm.onReady.add(Delegate(this, function () {

                var repository = Get("Ratio.Repository");
                repository.initialize(this.idbOrm);
                repositoryTask.next();
            }));

            this.idbOrm.onError;

            this.idbOrm.initialize(Ratio.Entities);
        });

        return repositoryTask;
    };

    /* pull in first run or home page content */
    DataContext.prototype.buildWebServiceTask = function () {
        var webServiceTask = new Task();
        webServiceTask.work = Delegate(this, function () {
            var webService = Get.Ratio.WebService();
            webService.initialize().then(Delegate(this, function (results) {
                webServiceTask.next();
            }));
        });

        return webServiceTask;
    };

    /* webService and repository tasks have completed, initialize the dataService */
    DataContext.prototype.buildDataServiceTask = function () {
        var dataServiceTask = new Task();
        dataServiceTask.work = Delegate(this, function () {
            var dataService = Get.Ratio.DataService();
            dataService.initialize().then(Delegate(this, function () {
                dataServiceTask.next();
            }));
        });

        return dataServiceTask;
    };

    return DataContext;
}();