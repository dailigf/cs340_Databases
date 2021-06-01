module.exports = function () {
    var express = require('express');
    var router = express.Router();

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

    function getApplication(res, mysql, context, id, complete) {
        /*Helper function used to get a specific app in the Applications Table by id, assigns it to context
         * Which is then used by the handlebars page to display the app*/

        var sql = "SELECT * FROM Applications WHERE appID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.application = results[0];
            complete();
        });
    }

    function deleteControlInstances(res, mysql, id, complete) {
        /* Function will be used to delete a Control_Instance from the Control_Instance Table.*/
        var sql = "DELETE FROM Control_Instances WHERE guideID = (SELECT guideID FROM Guides WHERE appID = ?)";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            complete();
        });
    }

    function deleteGuides(res, mysql, id, complete) {
        /* Function will be used to delete a Guide from the Guides Table*/
        var sql = "DELETE FROM Guides WHERE appID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            complete();
        });
    }
    function deleteApp(res, mysql, id, complete) {
        /* Function will be used to delete an application from the Applications table.*/

        var sql = "DELETE FROM Applications WHERE appID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            complete();
        });
    };

    function deleteAppInstances(res, mysql, id, complete) {
        /* Function will be used to delete the entries in the App_Instances table.*/

        var sql = "DELETE FROM App_Instances WHERE appID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            complete();
        });
    };

    router.get('/', function (req, res) {
        /*Route that is used when viewing the Applications table.  It will perform a sql query to get
         * information for the applications and then display them*/

        console.log("inside router.get for applications");
        var callbackcount = 0;
        var context = {};
        context.jsscripts = ["updateApplications.js"];
        var mysql = req.app.get('mysql');
        getApplications(res, mysql, context, complete);
        function complete() {
            callbackcount++;
            if (callbackcount >= 1) {
                res.render('applications.handlebars', context);
            }
        }
    });

    router.get('/:id', function (req, res) {
        /*Route that is used when updating a target application.  It will perform a sql query to get
         * information for a target application and then redirect to the updateApplication page*/

        console.log('inside /application/id');
        callbackcount = 0;
        context = {};
        context.jsscripts = ["updateApplications.js"];
        var mysql = req.app.get('mysql');
        getApplication(res, mysql, context, req.params.id, complete);
        function complete() {
            callbackcount++;
            if (callbackcount >= 1) {
                res.render('updateApplication.handlebars', context);
            }
        }

    });

    router.post('/:id', function (req, res) {
        /*Route that is used when updating a target application.  It will perform a sql query to UPDATE
          information for a target application and then redirect to the applications page*/

        var mysql = req.app.get('mysql');
        var sql = "UPDATE Applications SET appName = ?, appType = ? WHERE appID = ?";
        var inserts = [req.body.appName, req.body.appType, req.params.id];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/applications');
            }
        });

    });

    router.post('/', function (req, res) {
        /*Route that is used when inserting a new application.  It will perform a sql query to INSERT
          information for a new application and then redirect to the applications page*/

        console.log('adding a new application');
        console.log(req.body);
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Applications (appName, appType) VALUES (?, ?)";
        var inserts = [req.body.appName, req.body.appType];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/applications');
            }
        });
    });

    router.delete('/:id', function (req, res) {
        /*When a user deletes an application, browser will 'DELETE' to this route.
         *Updates the Applications and App_Instances Table.
         *It then refreshes the /applications page */

        console.log('inside router.delete');
        console.log(req.params.id);
        var callbackcount = 0;
        var mysql = req.app.get('mysql');
        var context = {};
        context.jsscripts = ["updateApplications.js"];
        deleteControlInstances(res, mysql, req.params.id, complete);
        deleteGuides(res, mysql, req.params.id, complete);
        deleteAppInstances(res, mysql, req.params.id, complete);
        deleteApp(res, mysql, req.params.id, complete);
        getApplications(res, mysql, context, complete);
        function complete() {
            callbackcount++;
            if (callbackcount >= 5) {
                res.render('applications.handlebars', context);
            }
        }

    });

    return router;
}();