module.exports = function(){
	var express = require('express');
	var router = express.Router();

	function getOperatingSystems(res, mysql, context, complete){
		/* Function is used fetch the operating systems names from the Applications Table*/
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

	function deleteWorkstation(res, mysql, id, complete){
		/* Function will be used to delete the a workstation from the Workstations Table*/
		var sql = "DELETE FROM Workstations WHERE workstationID = ? ";
		var inserts = [id];
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			complete();
		});
	};

	function deleteAppInstances(res, mysql, id, complete){
		/* Function will be used to delete the entries in the App_Instances Table*/
		var sql = "DELETE FROM App_Instances WHERE workstationID = ?";
		var inserts = [id];
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			complete();
		});
	};

	function updateAddresses(res, mysql, id, complete){
		/* Function will be used to update the Addresses Table. Needed when deleting a workstation.
		 * Will set the workstationID to NULL in the Addresses Table*/
		var sql = "UPDATE Addresses " +
			"SET workstationID = NULL " +
			"WHERE workstationID = ?";
		var inserts = [id];
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			complete();
		});
	};
	function getWorkstations(res, mysql, context, complete){
		/*Function will be used to retrieve workstations in Workstations Table
		 * Used to display in the workstation.handlebars page*/
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
		/*Function will retrieve a single workstation.  Used when the user updates a 
		 * workstation*/
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
		/*Function will used the string input by the user to search for workstations
		 * that have a matchign substring*/
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
		/*root page for workstations.  Calls getWorkstations() and getOperatingSystems to populate
		 * workstations.handlebars page.*/
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
		/*When the user clicks on the search button, the browser will submit a post to this route
		 * the body will contain the user supplied string*/
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
		/*When the user clicks on the update link for a target workstation, browser will 'GET'
		 * to this route.  Browser will supply the workstationID, which will be used in the 
		 * getWorkstation() function, it will then redirect to updateWorkstation page*/
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
		/*When the user updates a worktation, browser will submit must a 'POST' request to this route
		 * The user supplied information will be used to update Workstations Table*/
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
		/*When the user add a new workstation, browser will submit a 'POST' request to this route
		 * User supplied input will be used to INSERT into the Workstations Table */
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

	router.delete('/:id', function(req, res){
		/*When user deletes a workstation, browser will 'DELETE' to this route.
		 * Updates the Addresses, App_Instances, and Workstations Table
		 * It then refreshes the /workstations page */
		console.log('inside router.delete');
		console.log(req.params.id);
		var callbackcount = 0;
		var mysql = req.app.get('mysql');
		var context = {};
		context.jsscripts = ["updateWorkstations.js"];
		updateAddresses(res,mysql, req.params.id, complete);
		deleteAppInstances(res, mysql, req.params.id, complete);
		deleteWorkstation(res, mysql, req.params.id, complete);
		getWorkstations(res, mysql, context, complete);
		getOperatingSystems(res, mysql, context, complete);
		function complete(){
			callbackcount++;
			if(callbackcount >= 5){
				res.render('workstations.handlebars', context);
			}
		}
	});

	return router;

}();
