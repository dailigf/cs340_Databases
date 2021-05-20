module.exports = function () {
    var express = require('express');
    var router = express.Router();

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
    };

    function getAddresses(res, mysql, context, complete) {
        var query = "SELECT addressID, ip, workstationID FROM Addresses";
        mysql.pool.query(query, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.addresses = results;
            console.log(context.addresses);
            complete();
        })
    }


    router.get('/', function (req, res) {
        console.log("inside router.get");
        var callbackcount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getWorkstations(res, mysql, context, complete);
        getAddresses(res, mysql, context, complete);
        function complete() {
            callbackcount++;
            if (callbackcount >= 2) {
                res.render('addresses.handlebars', context);
            }
        }
    });

    router.post('/', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Addresses (ip, workstationID) VALUES (?, ?)";
        if (req.body.workstationID == "") {
            req.body.workstationID = null;
        };
        var inserts = [req.body.ip, req.body.workstationID];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/addresses')
            }
        });
    });
    return router;

}();