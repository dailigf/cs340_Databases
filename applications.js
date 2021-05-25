module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getApplications(res, mysql, context, complete){
        var query = "SELECT * FROM Applications";
        mysql.pool.query(query, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.applications = results;
			complete();
		})
    };

    router.get('/', function(req, res){
        var callbackcount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getApplications(res, mysql, context, complete);
        function complete(){
            callbackcount++
            if(callbackcount >= 1){
                res.render('applications.handlebars', context);
            }
        }
    });

    return router;
}