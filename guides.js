module.exports = function(){
	var express = require('express');
	var router = express.Router();

	function getApplications(res, mysql, context, complete){
		/*Helper function, used to retrieve a Applications that do not have an associated Guide
		 * This information is used to populate the drop down in the Add Guide section of the
		 *'/guides' route.*/
		console.log('getting  null Applications');
		var query = "SELECT Applications.appID, Applications.appName, Guides.guideID, Guides.guideID FROM Applications " + 
			"LEFT JOIN Guides ON Applications.appID = Guides.appID WHERE guideID IS NULL";
		mysql.pool.query(query, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.App = results;
			complete();
		})
	};

	function getAvailableApps(res, mysql, context, complete){
		/*Helper functio that retrieves all applications from teh Applications Table*/
		var query = "SELECT Applications.appID, Applications.appName FROM Applications";
		mysql.pool.query(query, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.App = results;
			complete();
		})

	};

	function getGuides(res, mysql, context, complete){
		/*Helper function that retrieves all of the guides from the Guides Table*/
		var query = "SELECT guideID, guideName, appID FROM Guides";
		mysql.pool.query(query, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.guide = results;
			complete();
		})
	};

	function addGuide(res, mysql, req, context, complete){
		/*Function that is used to insert a new guide into the Guides table*/
		var sql1 = "INSERT INTO Guides (guideName, appID) VALUES " +
			"(?, ?)";
		var inserts1 = [req.body.guideName, req.body.appID];
		mysql.pool.query(sql1, inserts1, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			complete();
		})
	};

	function deleteControlInstances(res, mysql, id, context, complete){
		/*Function used to delete a target guide from the Control_Instances Table*/
		var sql1 = "DELETE FROM Control_Instances WHERE guideID = ?";
		var inserts1 = [id];
		mysql.pool.query(sql1, inserts1, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			complete();
		})
	};

	function deleteGuide(res, mysql, id, context, complete){
		/*Deletes a target guide form the Guides Table. */
		var sql1 = "DELETE FROM Guides WHERE guideID = ?";
		var inserts1 = [id];
		mysql.pool.query(sql1, inserts1, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			complete();
		})
	};

	function getGuide(res, mysql, context, id, complete){
		/*Sql Query creates a composite table which joins the Guides and Applications Table. It maps
		 * guides to an application. */
		var sql = "SELECT Guides.guideID, Guides.guideName, Applications.appID, Applications.appName, Applications.appType FROM Guides " +
			"JOIN Applications ON Guides.appID = Applications.appID " +
			"Where Guides.guideID = ?";
        	var inserts = [id];
        	mysql.pool.query(sql, inserts, function(error, results, fields){
            		if(error){
                		res.write(JSON.stringify(error));
                		res.end();
            		}
            		context.guide = results[0];
            		complete();
        	});
    	}

	function updateGuide(res, mysql, req, context, complete){
		/*Updates a target guide with user supplied input from the form*/
		var sql1 = "UPDATE Guides " +
			"SET guideName = ?, appID = (SELECT appID FROM Applications WHERE appName = ?) " +
			"WHERE guideID = ?";
		var inserts1 = [req.body.guideName, req.body.appName, req.params.id];
		mysql.pool.query(sql1, inserts1, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			complete();
		});

	}


	router.get('/', function(req, res){
		/* Root route for '/guides'.  Runs two sql queries to get Applications that do not have a
		 * guide for the 'Add Guide' Section and get all the Guides to display on the page */
		var callbackcount = 0;
		var context = {};
		var mysql = req.app.get('mysql');
		context.jsscripts = ["guides.js"];
		//context.css = ["controls.css"];
		getApplications(res, mysql, context, complete);
		getGuides(res, mysql, context, complete);
		function complete(){
			callbackcount++;
			if(callbackcount >= 2){
				res.render('guides.handlebars', context);
			}
		}
	});

	router.get('/:id', function(req, res){
		/*Route that is invoked when updating a target guide, will retrieve information about 
		 * a specific guide and will also get a list of Application that do not have a guide 
		 * asigned.  Will redirect to '/updateGuide' page*/
		callbackcount = 0;
		context = {};
		context.jsscripts = ["selectApp.js", "guides.js"];
		//context.css = ["controls.css"];
		console.log(req.params.id);
		var mysql = req.app.get('mysql');
		getGuide(res, mysql, context, req.params.id, complete);
		getAvailableApps(res, mysql, context, complete);
		function complete(){
			callbackcount++;
			if(callbackcount >= 2){
				console.log(context.guide);
				console.log(context.App);
				res.render('updateGuide.handlebars', context);
			}
		}

	});

	router.post('/:id', function(req, res){
		/*Route that is invoked from within the '/updateGuide' page.  Will update a target guide
		 * with user supplied information in the form*/
		console.log('updating the current guide');
		callbackcount = 0;
		context = {};
		context.jsscripts = ["controls.jss"];
		//context.css = ["controls.css"];
		var mysql = req.app.get('mysql');
		updateGuide(res, mysql, req, context, complete);
		getApplications(res, mysql, context, complete);
		getGuides(res, mysql, context, complete);
		function complete(){
			callbackcount++;
			if(callbackcount >= 3){
				res.render('guides.handlebars', context);

			}

		}
	});

	router.post('/', function(req, res){
		/*Route that is invoked when adding a new guide.  Insert a new entry into the Guides table.*/
		var callbackcount = 0;
		var context = {};
		var mysql = req.app.get('mysql');
		//context.jsscripts = ["controls.jss"];
		//context.css = ["controls.css"];
		addGuide(res, mysql, req, context, complete);
		getApplications(res, mysql, context, complete);
		getGuides(res, mysql, context, complete);
		function complete(){
			callbackcount++;
			if(callbackcount >= 3){
				res.render('guides.handlebars', context);
			}
		}

	});

	router.delete('/:id', function(req, res){
		/*Route that invoked when deleteing a guide.  Will delete the control from the 
		 * Control_Instances Table and then delete the control from the Controls Table.
		 * Will re-render the root '/guides' page*/
		callbackcount = 0;
		context = {};
		context.jsscripts = ["guides.jss"];
		//context.css = ["controls.css"];
		var mysql = req.app.get('mysql');
		deleteControlInstances(res, mysql, req.params.id, context, complete);
		deleteGuide(res, mysql, req.params.id, context, complete);
		getApplications(res, mysql, context, complete);
		getGuides(res, mysql, context, complete);
		function complete(){
			callbackcount++;
			if(callbackcount >= 4){
				res.render('guides.handlebars', context);

			}
		}
	});


	return router;

}();
