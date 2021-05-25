module.exports = function () {
    var express = require('express');
    var router = express.Router();

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

    function getApplication(res, mysql, context, id, complete) {
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

    router.get('/', function (req, res) {
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
        console.log('inside router.delete');
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Applications WHERE appID = ?";
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

    });

    return router;
}();