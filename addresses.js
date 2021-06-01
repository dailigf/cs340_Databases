module.exports = function () {
    var express = require('express');
    var router = express.Router();

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

    function getAddress(res, mysql, context, id, complete) {
        /*Helper function used to get a specific address in the Addresses Table by id, assigns it to context
         * Which is then used by the handlebars page to display the address*/

        var sql = "SELECT addressID, ip, workstationID FROM Addresses WHERE addressID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.address = results[0];
            console.log(context.address);
            complete();
        })
    }
    function getAddresses(res, mysql, context, complete) {
        /*Helper function used to get all the addresses in the Addresses Table, assigns it to context
         * Which is then used by the handlebars page to display the addresses*/

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
        /*Route that is used when viewing the Addresses table.  It will perform an sql query to get
         * information for the addresses and then display them*/

        console.log("inside router.get");
        var callbackcount = 0;
        var context = {};
        context.jsscripts = ["updateAddresses.js"];
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

    router.get('/:id', function (req, res) {
        /*Route that is used when updating a target address.  It will perform an sql query to get
         * information for a target address and then redirect to the updateAddress page*/

        console.log('inside /address/id');
        callbackcount = 0;
        context = {};
        context.jsscripts = ["selectWorkstation.js", "updateAddresses.js"];
        var mysql = req.app.get('mysql');
        getAddress(res, mysql, context, req.params.id, complete);
        getWorkstations(res, mysql, context, complete);
        function complete() {
            callbackcount++
            if (callbackcount >= 2) {
                res.render('updateAddress.handlebars', context);
            }
        }
    });

    router.post('/:id', function (req, res) {
        /*Route that is used when updating a target address.  It will perform an sql query to UPDATE
          information for a target address and then redirect to the Addresses page*/

        var mysql = req.app.get('mysql');
        var sql = "UPDATE Addresses SET ip = ?, workstationID = ? WHERE addressID = ?";
        if (req.body.workstationID == "") {
            req.body.workstationID = null;
        };
        var inserts = [req.body.ip, req.body.workstationID, req.params.id];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/addresses');
            }
        });
    });

    router.post('/', function (req, res) {
        /*Route that is used when inserting a new address.  It will perform an sql query to INSERT
          information for a new address and then redirect to the Addresses page*/

        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Addresses (ip, workstationID) VALUES (?, ?)";
        if (req.body.workstationID == "") {
            req.body.workstationID = null;
        };
        var inserts = [req.body.ip, req.body.workstationID];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(error)
                if (error.errno == 1062) {
                    context = {};
                    context.error = error;
                    res.render('errors.handlebars', context);
                } else {
                    res.write(JSON.stringify(error));
                    res.end();
                }
            } else {
                res.redirect('/addresses');
            }
        });
    });


    router.delete('/:id', function (req, res) {
        /*Route that is used when deleting a target address.  It will perform an sql query to DELETE
          information for a target address and then redirect to the Addresses page*/

        console.log('inside router.delete');
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Addresses WHERE addressID = ?";
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