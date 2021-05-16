module.exports = function(){
	var express = require('express');
	var router = express.Router();

	function getOperatingSystems(res, mysql, context, complete){
		var query = "SELECT appID, appName FROM Applications " +
			"WHERE appType = 'Operating System'";
		mysql.pool.query(query, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.operatingSystems = results;
			console.log(context.operatingSystems);
			complete();
		})
	};

	function getWorkstations(res, mysql, context, complete){
		var query = "SELECT workstationID, hostName, os FROM Workstations";
		mysql.pool.query(query, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.workstations = results;
			console.log(context.workstations);
			complete();
		})
	};

	router.get('/', function(req, res){
		console.log("inside router.get");
		var callbackcount = 0;
		var context = {};
		var mysql = req.app.get('mysql');
		getWorkstations(res, mysql, context, complete);
		getOperatingSystems(res, mysql, context, complete);
		function complete(){
			callbackcount++;
			if(callbackcount >= 2){
				res.render('workstations.handlebars', context);
			}
		}
	});

	router.post('/', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO Workstations (hostName, os) VALUES (?, ?)";
		var inserts = [req.body.hostName, req.body.os];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}else{
				res.redirect('/workstations');
			}
		});

	});

	return router;

}();
