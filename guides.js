module.exports = function(){
	var express = require('express');
	var router = express.Router();

	function getApplications(res, mysql, context, complete){
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
		console.log('getting all Applications');
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
		console.log('inside addGuide()');
		console.log(req.body.appID);
		console.log(req.body.guideName);
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
		var sql1 = "DELETE FROM Control_Instances WHERE guideID = ?";
		var inserts1 = [id];
		console.log('inside deleteControlInstances');
		console.log(id);
		mysql.pool.query(sql1, inserts1, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			complete();
		})
	};

	function deleteGuide(res, mysql, id, context, complete){
		console.log('Inside deleteGuide');
		console.log(id);
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
		console.log('inside /guides/id');
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
		console.log('updating the current guide');
		console.log(req.params.id);
		console.log(req.body.guideName);
		console.log(req.body.appName);
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
		console.log('adding a new guide');
		console.log(req.body);
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
		console.log('inside router.delete');
		console.log(req.params.id);
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
