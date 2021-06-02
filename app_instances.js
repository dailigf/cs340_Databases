const { query } = require('express');
const { get } = require('./workstations');

module.exports = function () {
    var express = require('express');
    var router = express.Router();

    function getApp_Instances(res, mysql, context, complete) {
        /*Helper function used to get all the App_Instances in the App_Instances Table, assigns it to context
         * Which is then used by the handlebars page to display the App_Instances*/

        var query = "SELECT * FROM App_Instances";
        mysql.pool.query(query, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.App_Instances = results;
            console.log(context.App_Instances);
            complete();
        })
    }

    function getWorkstations(res, mysql, context, complete) {
        /*Helper function used to get all the Workstations in the Workstations Table, assigns it to context
         * Which is then used by the handlebars page to display the Workstations*/

        var query = "SELECT workstationID, hostName, os FROM Workstations";
        mysql.pool.query(query, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.workstations = results;
            console.log(context.workstations);
            complete();
        })
    }
    function getApplications(res, mysql, context, complete) {
        /*Helper function used to get all the apps in the Applications Table, assigns it to context
         * Which is then used by the handlebars page to display the Applications*/
        var query = "SELECT appID, appName, appType FROM Applications";
        mysql.pool.query(query, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.applications = results;
            console.log(context.applications);
            complete();
        })
    }

    function getApp_Instance(res, mysql, context, id, complete) {
        /*Helper function used to get a specific app in the App_Instances Table by id, assigns it to context
         * Which is then used by the handlebars page to display the app*/

        var sql = "SELECT * FROM App_Instances WHERE appInstanceID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.App_Instance = results[0];
            console.log(context.App_instance);
            complete();
        })
    }

    router.get('/', function (req, res) {
        /*Route that is used when viewing the App_Instance table.  It will perform an sql query to get
         * information for the app_instances and then display them*/

        console.log("inside router.get");
        var callbackcount = 0;
        var context = {};
        context.jsscripts = ['updateApp_Instances.js'];
        var mysql = req.app.get('mysql');
        getApp_Instances(res, mysql, context, complete);
        getWorkstations(res, mysql, context, complete);
        getApplications(res, mysql, context, complete);
        function complete() {
            callbackcount++;
            if (callbackcount >= 3) {
                res.render('app_instances.handlebars', context);
            }
        }
    });

    router.post('/', function (req, res) {
        /*Route that is used when inserting a new App_Instance.  It will perform a sql query to INSERT
          information for a new App_Instance and then redirect to the App_Instances page*/

        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO App_Instances (appID, workstationID) VALUES (?, ?)";
        var inserts = [req.body.appID, req.body.workstationID];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                context = {};
                context.error = error;
                context.string = JSON.stringify(error);
                res.render('errors.handlebars', context);
            } else {
                res.redirect('/app_instances');
            }
        });
    });

    router.get('/:id', function (req, res) {
        /*Route that is used when updating a target App_Instance.  It will perform an sql query to get
         * information for a target App_Instance and then redirect to the updateApp_Instance page*/

        console.log('inside /app_instancce/id');
        callbackcount = 0;
        context = {};
        context.jsscripts = ["selectWorkstation.js", "selectApplication.js", "updateApp_Instances.js"];
        var mysql = req.app.get('mysql');
        getApp_Instance(res, mysql, context, req.params.id, complete);
        getWorkstations(res, mysql, context, complete);
        getApplications(res, mysql, context, complete)
        function complete() {
            callbackcount++
            if (callbackcount >= 3) {
                res.render('updateApp_Instance.handlebars', context);
            }
        }
    });

    router.post('/:id', function (req, res) {
        /*Route that is used when updating a target App_Instance.  It will perform an sql query to UPDATE
          information for a target App_Instance and then redirect to the App_Instances page*/

        var mysql = req.app.get('mysql');
        var sql = "UPDATE App_Instances SET appID = ?, workstationID = ? WHERE appInstanceID = ?";
        var inserts = [req.body.appID, req.body.workstationID, req.params.id]
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                context = {};
                context.error = error;
                context.string = JSON.stringify(error);
                res.render('errors.handlebars', context);
            } else {
                res.redirect('/app_instances');
            }
        });
    });

    router.delete('/:id', function (req, res) {
        /*Route that is used when deleting a target App_Instnace.  It will perform an sql query to DELETE
          information for a target App_Instance and then redirect to the App_Instances page*/

        console.log('inside router.delete');
        var mysql = req.app.get('mysql');
        var sqlQ = "DELETE FROM App_Instances WHERE appInstanceID = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sqlQ, inserts, function (error, results, fields) {
            if (error) {
                context = {};
                context.error = error;
                context.string = JSON.stringify(error);
                res.render('errors.handlebars', context);
            } else {
                res.redirect('/app_instances');
            }
        });
    })
    return router;

}();