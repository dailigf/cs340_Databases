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
			complete();
		})
	};

	function getWorkstation(res, mysql, context, id, complete){
		var sql = "SELECT workstationID, hostName, os FROM Workstations WHERE workstationID = ?";
        	var inserts = [id];
        	mysql.pool.query(sql, inserts, function(error, results, fields){
            		if(error){
                		res.write(JSON.stringify(error));
                		res.end();
            		}
            		context.workstation = results[0];
            		complete();
        	});
    	}
	function searchWorkstation(res, mysql, context, searchString, complete){
		var sql = "SELECT workstationID, hostName, os FROM Workstations WHERE hostName LIKE ? " +
			"UNION SELECT workstationID, hostName, os FROM Workstations WHERE os LIKE ?"
		var searchMe = "%" + searchString + "%";
		var inserts = [searchMe, searchMe];
        	mysql.pool.query(sql, inserts, function(error, results, fields){
            		if(error){
                		res.write(JSON.stringify(error));
                		res.end();
            		}
            		context.workstation = results;
            		complete();
        	});
	}


	router.get('/', function(req, res){
		var callbackcount = 0;
		var context = {};
		var mysql = req.app.get('mysql');
		context.jsscripts = ["updateWorkstations.js"];
		getWorkstations(res, mysql, context, complete);
		getOperatingSystems(res, mysql, context, complete);
		function complete(){
			callbackcount++;
			if(callbackcount >= 2){
				res.render('workstations.handlebars', context);
			}
		}
	});

	router.get('/search/', function(req, res){
		var callbackcount = 0;
		var context = {};
		var mysql = req.app.get('mysql');
		context.jsscripts = ["updateWorkstations.js"];
		searchWorkstation(res, mysql, context, req.query.searchString, complete);
		getWorkstations(res, mysql, context, complete);
		getOperatingSystems(res, mysql, context, complete);
		function complete(){
			callbackcount++;
			if(callbackcount >= 3){
				res.render('workstations.handlebars', context);
			}
		}
	});

	router.get('/:id', function(req, res){
		console.log('inside /workstation/id');
		callbackcount = 0;
		context = {};
		context.jsscripts = ["selectOS.js", "updateWorkstations.js"];
		var mysql = req.app.get('mysql');
		getWorkstation(res, mysql, context, req.params.id, complete);
		getOperatingSystems(res, mysql, context, complete);
		function complete(){
			callbackcount++;
			if(callbackcount >= 2){
				res.render('updateWorkstation.handlebars', context);
			}
		}

	});

	router.post('/:id', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = "UPDATE Workstations SET hostName = ?, os = ? WHERE workstationID = ?";
		var inserts = [req.body.hostName, req.body.os, req.params.id];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}else{
				res.redirect('/workstations');
			}
		});

	});

	router.post('/', function(req, res){
		console.log('adding a new workstation');
		console.log(req.body);
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

	router.get('/search/', function(req, res){
		console.log('test');
		console.log(req.query);
	});

	router.delete('/:id', function(req, res){
		console.log('inside router.delete');
		var mysql = req.app.get('mysql');
		var sql = "DELETE FROM Workstations WHERE workstationID = ?";
		var inserts = [req.params.id];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.status(400);
				res.end();
			}else{
				res.status(202).end();
			}
		});

	});


	return router;

}();
