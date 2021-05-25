const { query } = require('express');
const { get } = require('./workstations');

module.exports = function () {
    var express = require('express');
    var router = express.Router();

    function getApp_Instances(res, mysql, context, complete) {
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
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO App_Instances (appID, workstationID) VALUES (?, ?)";
        var inserts = [req.body.appID, req.body.workstationID];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/app_instances')
            }
        });
    });

    router.get('/:id', function (req, res) {
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
        var mysql = req.app.get('mysql');
        var sql = "UPDATE App_Instances SET appID = ?, workstationID = ? WHERE appInstanceID = ?";
        var inserts = [req.body.appID, req.body.workstationID, req.params.id]
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/app_instances');
            }
        });
    });

    router.delete('/:id', function (req, res) {
        console.log('inside router.delete');
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM App_Instances WHERE appInstanceID = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            } else {
                res.status(202).end();
            }
        });
    })
    return router;

}();