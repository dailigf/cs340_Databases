module.exports = function(){
	var express = require('express');
	var router = express.Router();

	function getControls(res, mysql, context, complete){
		var query = "SELECT controlID, securityControlID, controlName, description FROM Controls";
		mysql.pool.query(query, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.controls = results;
			complete();
		})
	};

	function deleteControlInstances(res, mysql, id, context, complete){
		var sql1 = "DELETE FROM Control_Instances WHERE controlID = ?";
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

	function deleteControl(res, mysql, id, context, complete){
		console.log('Inside deleteControl');
		console.log(id);
		var sql1 = "DELETE FROM Controls WHERE controlID = ?";
		var inserts1 = [id];
		mysql.pool.query(sql1, inserts1, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			complete();
		})
	};

	function getControl(res, mysql, context, id, complete){
		var sql = "SELECT controlID, securityControlID, controlName, description FROM Controls WHERE controlID = ?";
        	var inserts = [id];
        	mysql.pool.query(sql, inserts, function(error, results, fields){
            		if(error){
                		res.write(JSON.stringify(error));
                		res.end();
            		}
            		context.control = results[0];
            		complete();
        	});
    	}
	function updateControl(res, mysql, req, context, complete){
		var sql1 = "UPDATE Controls " +
			"SET controlName = ?, description = ? " +
			"WHERE controlID = ?";
		var inserts1 = [req.body.controlName, req.body.description, req.body.controlID];
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
		context.jsscripts = ["controls.js"];
		context.css = ["controls.css"];
		getControls(res, mysql, context, complete);
		function complete(){
			callbackcount++;
			if(callbackcount >= 1){
				res.render('controls.handlebars', context);
			}
		}
	});

	router.get('/:id', function(req, res){
		console.log('inside /controls/id');
		callbackcount = 0;
		context = {};
		//context.jsscripts = ["selectOS.js", "updateWorkstations.js"];
		context.css = ["controls.css"];
		console.log(req.params.id);
		var mysql = req.app.get('mysql');
		getControl(res, mysql, context, req.params.id, complete);
		//getOperatingSystems(res, mysql, context, complete);
		function complete(){
			callbackcount++;
			if(callbackcount >= 1){
				console.log(context);
				res.render('updateControl.handlebars', context);
			}
		}

	});

	router.post('/:id', function(req, res){
		callbackcount = 0;
		context = {};
		context.jsscripts = ["controls.jss"];
		context.css = ["controls.css"];
		var mysql = req.app.get('mysql');
		updateControl(res, mysql, req, context, complete);
		getControls(res, mysql, context, complete);
		function complete(){
			callbackcount++;
			if(callbackcount >= 2){
				res.render('controls.handlebars', context);

			}

		}
	});

	router.post('/', function(req, res){
		console.log('adding a new control');
		console.log(req.body);
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO Controls (securityControlID, controlName, description) VALUES (?, ?, ?)";
		var inserts = [req.body.securityControlID, req.body.controlName, req.body.description];
		var context = {};
		context.jsscripts = ["controls.jss"];
		context.css = ["controls.css"];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}else{
				res.redirect('/controls');
			}
		});

	});

	router.delete('/:id', function(req, res){
		console.log('inside router.delete');
		console.log(req.params.id);
		callbackcount = 0;
		context = {};
		context.jsscripts = ["controls.jss"];
		context.css = ["controls.css"];
		var mysql = req.app.get('mysql');
		deleteControlInstances(res, mysql, req.params.id, context, complete);
		deleteControl(res, mysql, req.params.id, context, complete);
		getControls(res, mysql, context, complete);
		function complete(){
			callbackcount++;
			if(callbackcount >= 3){
				res.render('controls.handlebars', context);

			}
		}
	});


	return router;

}();
