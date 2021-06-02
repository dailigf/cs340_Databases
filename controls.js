module.exports = function () {
	var express = require('express');
	var router = express.Router();

	function getControls(res, mysql, context, complete) {
		/*Helper function used to get all the controls in the Controls Table, assigns it to context
		 * Which is then used by the handlebars page to display the controls*/
		var query = "SELECT controlID, securityControlID, controlName, description FROM Controls";
		mysql.pool.query(query, function (error, results, fields) {
			if (error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			context.controls = results;
			complete();
		})
	};

	function deleteControlInstances(res, mysql, id, context, complete) {
		/*Helper function used to delete Control Instances from the Control Instances Table for a 
		 * target control*/
		var sql1 = "DELETE FROM Control_Instances WHERE controlID = ?";
		var inserts1 = [id];
		mysql.pool.query(sql1, inserts1, function (error, results, fields) {
			if (error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			complete();
		})
	};

	function deleteControl(res, mysql, id, context, complete) {
		/*Function used to delete a control from teh Controls table, uses id parameter that is 
		 * supplied when clicking the delete button */
		var sql1 = "DELETE FROM Controls WHERE controlID = ?";
		var inserts1 = [id];
		mysql.pool.query(sql1, inserts1, function (error, results, fields) {
			if (error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			complete();
		})
	};

	function getControl(res, mysql, context, id, complete) {
		/*Helper function that is called when a user updates a target control.
		 * Get information associated with controlID supplied when the user clicks on update btn*/
		var sql = "SELECT controlID, securityControlID, controlName, description FROM Controls WHERE controlID = ?";
		var inserts = [id];
		mysql.pool.query(sql, inserts, function (error, results, fields) {
			if (error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			context.control = results[0];
			complete();
		});
	}
	function updateControl(res, mysql, req, context, complete) {
		/*Function updates the Controls table for a target controlID.  Updates with the user supplied
		 * values in the form.*/
		var sql1 = "UPDATE Controls " +
			"SET controlName = ?, description = ? " +
			"WHERE controlID = ?";
		var inserts1 = [req.body.controlName, req.body.description, req.body.controlID];
		mysql.pool.query(sql1, inserts1, function (error, results, fields) {
			if (error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			complete();
		});

	}


	router.get('/', function (req, res) {
		/*Route for the root page for Controls.*/
		var callbackcount = 0;
		var context = {};
		var mysql = req.app.get('mysql');
		context.jsscripts = ["controls.js"];
		context.css = ["controls.css"];
		getControls(res, mysql, context, complete);
		function complete() {
			callbackcount++;
			if (callbackcount >= 1) {
				res.render('controls.handlebars', context);
			}
		}
	});

	router.get('/:id', function (req, res) {
		/*Route that is used when updating a target control.  It will perform an sql query to get
		 * information for a target control and then redirect to the updateControl page*/
		console.log('inside /controls/id');
		callbackcount = 0;
		context = {};
		context.css = ["controls.css"];
		console.log(req.params.id);
		var mysql = req.app.get('mysql');
		getControl(res, mysql, context, req.params.id, complete);
		function complete() {
			callbackcount++;
			if (callbackcount >= 1) {
				console.log(context);
				res.render('updateControl.handlebars', context);
			}
		}

	});

	router.post('/:id', function (req, res) {
		/*Route that is invoked from the /updateControl page.  It uses the user supplied input in
		 * that page's form to update the Controls Table for the target Control.
		 * After the control info is updated it renders the root '/conrols' page*/
		callbackcount = 0;
		context = {};
		context.jsscripts = ["controls.jss"];
		context.css = ["controls.css"];
		var mysql = req.app.get('mysql');
		updateControl(res, mysql, req, context, complete);
		getControls(res, mysql, context, complete);
		function complete() {
			callbackcount++;
			if (callbackcount >= 2) {
				res.render('controls.handlebars', context);
			}

		}
	});

	router.post('/', function (req, res) {
		/*Route that is invoked when the user adds a new control when the click the submit button
		 * Uses user supplied input in the form to Insert a new control in the Controls Table */
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO Controls (securityControlID, controlName, description) VALUES (?, ?, ?)";
		var inserts = [req.body.securityControlID, req.body.controlName, req.body.description];
		var context = {};
		context.jsscripts = ["controls.jss"];
		context.css = ["controls.css"];
		sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
			if (error) {
				context = {};
				context.error = error;
				context.string = JSON.stringify(error);
				res.render('errors.handlebars', context);
			} else {
				res.redirect('/controls');
			}
		});

	});

	router.delete('/:id', function (req, res) {
		/*Route that is invoked when the delete button for a target control is clicked. Will update
		 * the Control_Instances and Controls Table.*/
		callbackcount = 0;
		context = {};
		context.jsscripts = ["controls.jss"];
		context.css = ["controls.css"];
		var mysql = req.app.get('mysql');
		deleteControlInstances(res, mysql, req.params.id, context, complete);
		deleteControl(res, mysql, req.params.id, context, complete);
		getControls(res, mysql, context, complete);
		function complete() {
			callbackcount++;
			if (callbackcount >= 3) {
				res.render('controls.handlebars', context);

			}
		}
	});


	return router;

}();
