module.exports = function () {
	var express = require('express');
	var router = express.Router();

	function getControlInstances(res, mysql, context, complete) {
		/*Function creates a composite table which joins Control_Instances, Controls, and Guides.
		 * Information is used to populate the root page '/control_instances'*/
		var query = "SELECT Control_Instances.controlInstanceID AS controlInstanceID, Control_Instances.controlID AS controlID, Controls.securityControlID AS securityControlID, " +
			"Controls.controlName AS controlName, Control_Instances.guideID AS guideID, Guides.guideName AS guideName FROM Control_Instances " +
			"JOIN Controls ON Control_Instances.controlID = Controls.controlID " +
			"JOIN Guides ON Control_Instances.guideID = Guides.guideID";
		mysql.pool.query(query, function (error, results, fields) {
			if (error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			context.controlInstance = results;
			complete();
		})
	};

	function getControls(res, mysql, context, complete) {
		/*Function used to get the controls from teh Controls table*/
		var query = "SELECT controlID, controlName FROM Controls";
		mysql.pool.query(query, function (error, results, fields) {
			if (error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			context.controls = results;
			complete();
		})
	};

	function getGuides(res, mysql, context, complete) {
		/*Function used to get the guides from the Guides table*/
		var query = "SELECT guideID, guideName FROM Guides";
		mysql.pool.query(query, function (error, results, fields) {
			if (error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			context.guides = results;
			complete();
		})
	};

	function addControlInstance(req, res, mysql, context, complete) {
		/*Function used to add a new entry into the Control_Instances Table. */
		var query = "INSERT INTO Control_Instances (controlID, guideID) " +
			"VALUES (?, ?)";
		var inserts = [req.body.controlID, req.body.guideID]
		mysql.pool.query(query, inserts, function (error, results, fields) {
			if (error) {
				context.error = error;
				context.string = JSON.stringify(error);
				res.render('errors.handlebars', context);
				return;
			}
			complete();
		})

	}
	function deleteControlInstace(req, mysql, id, complete) {
		/*Function used to delete an entry from the Conrol_Instances Table*/
		var query = "DELETE FROM Control_Instances WHERE controlInstanceID = ?";
		var inserts = [id];
		mysql.pool.query(query, inserts, function (error, results, fields) {
			if (error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			complete();
		})
	}


	router.get('/', function (req, res) {
		/*Root route for conrol instances.  Retrieves information from Control_Instances, Controls,
		 * and Guides for the handlebars template to display */
		var callbackcount = 0;
		var context = {};
		var mysql = req.app.get('mysql');
		context.jsscripts = ["controlInstance.js"];
		getControlInstances(res, mysql, context, complete);
		getControls(res, mysql, context, complete);
		getGuides(res, mysql, context, complete);
		//getOperatingSystems(res, mysql, context, complete);
		function complete() {
			callbackcount++;
			if (callbackcount >= 3) {
				res.render('control_instances.handlebars', context);
			}
		}
	});

	router.post('/', function (req, res) {
		/*Route that is invoked when adding a new control.  Will update the Control_Instances Table
		 * re-renders the 'control_instances' page */
		console.log(req.body);
		var callbackcount = 0;
		var context = {};
		var mysql = req.app.get('mysql');
		//context.jsscripts = ["updateWorkstations.js"];
		addControlInstance(req, res, mysql, context, complete);
		getControls(res, mysql, context, complete);
		getGuides(res, mysql, context, complete);
		getControlInstances(res, mysql, context, complete);
		//getOperatingSystems(res, mysql, context, complete);
		function complete() {
			callbackcount++;
			if (callbackcount >= 4) {
				res.render('control_instances.handlebars', context);
			}
		}
	});


	router.delete('/:id', function (req, res) {
		/*Route that is invoked when deleting a control instance*/
		console.log('inside router.delete');
		var callbackcount = 0;
		var context = {}
		var mysql = req.app.get('mysql');
		context.jsscripts = ["controlInstance.js"];
		deleteControlInstace(req, mysql, req.params.id, complete)
		function complete() {
			callbackcount++;
			if (callbackcount >= 1) {
				res.render('control_instances.handlebars', context);
			}
		}

	});

	return router;

}();
