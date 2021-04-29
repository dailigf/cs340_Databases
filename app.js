// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
//PORT        = 31337;                 // Set a port number at the top so it's easy to change in the future

var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', handlebars);
app.set('port', 31337);

var db = require('./database/db_connector');

/*
    ROUTES
*/
/*
app.get('/', function(req, res)                 // This is the basic syntax for what is called a 'route'
    {
        res.send("The server is running!")      // This function literally sends the string "The server is running!" to the computer
    });                                         // requesting the web site.
*/
app.get('/', function(req, res){
	res.render('index.handlebars');
});

app.get('/index.html', function(req, res){
	res.render('index.handlebars');
});
app.get('/workstations', function(req, res){
	var testData = [
		{'workstationID': 1, 'name': 'dailigMac', 'os': 'MacOS', 'ip': '192.168.1.2'},
		{'workstationID': 2,'name': 'walshMac', 'os': 'MacOS', 'ip': '192.168.1.3'}
	];

	var context = {};
	context.dataList = testData
	res.render('workstations.handlebars', context);
});
app.get('/applications', function(req, res){
	var testData = [
		{'appID': '1', 'appName': 'spotify', 'appType': 'music'},
		{'appID': '2', 'appName': 'youtube', 'appType': 'video'}
	];

	var context = {};
	context.dataList = testData
	res.render('applications.handlebars', context);
});

app.get('/guides', function(req, res){
	var testData = [
		{'guideID': '1', 'guideName': 'guide1', 'appID': 1},
		{'guideID': '2', 'guideName': 'guide2', 'appID': 2}
	];
	var context = {};
	context.dataList = testData
	res.render('guides.handlebars', context);
});
app.get('/controls', function(req, res){
	var testData = [
		{'controlID': '1', 'securityControlNumber': 1, 'controlName': 'control1', 'description': 'This control does this!'},
		{'controlID': '2', 'securityControlNumber': 2, 'controlName': 'control2', 'description': 'This control does this!'}
	];
	var context = {};
	context.dataList = testData
	res.render('controls.handlebars', context);
});
app.get('/view5', function(req, res){
	res.render('view5.handlebars');
});
/*
    LISTENER
*/
app.listen(app.get('port'), function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.')
});

