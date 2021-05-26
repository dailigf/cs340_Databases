// App.js

/*
	SETUP
*/ var express = require('express');   // We are using the express library for the web server
var app = express();            // We need to instantiate an express object to interact with the server in our code
//PORT        = 31337;                 // Set a port number at the top so it's easy to change in the future

var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
var bodyParser = require('body-parser');

app.engine('handlebars', handlebars.engine);
app.set('view engine', handlebars);
app.set('port', 31337);
app.use('/static', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

var db = require('./database/db_connector');
app.set('mysql', db);

app.get('/', function (req, res) {
	res.render('index.handlebars');
});

app.get('/index.html', function (req, res) {
	res.render('index.handlebars');
});

app.use('/workstations', require('./workstations.js'));
app.use('/controls', require('./controls.js'));
app.use('/addresses', require('./addresses.js'));
app.use('/applications', require('./applications.js'));
app.use('/app_instances', require('./app_instances.js'));
app.use('/control_instances', require('./control_instances.js'));
app.use('/guides', require('./guides.js'));
/*
app.get('/workstations', function (req, res) {
	var testData = [
		{ 'workstationID': 1, 'hostName': 'dailigMac', 'os': 'MacOS' },
		{ 'workstationID': 2, 'hostName': 'walshMac', 'os': 'MacOS' }
	];

	var context = {};
	context.dataList = testData
	res.render('workstations.handlebars', context);
});
*/

/*
app.get('/applications', function (req, res) {
	var testData = [
		{ 'appID': 1, 'appName': 'spotify', 'appType': 'music' },
		{ 'appID': 2, 'appName': 'youtube', 'appType': 'video' }
	];

	var context = {};
	context.dataList = testData
	res.render('applications.handlebars', context);
});
*/

/*
app.get('/guides', function (req, res) {
	var testData = [
		{ 'guideID': 1, 'guideName': 'guide1', 'appID': 1 },
		{ 'guideID': 2, 'guideName': 'guide2', 'appID': 2 }
	];
	var context = {};
	context.dataList = testData
	res.render('guides.handlebars', context);
});
*/
/*
app.get('/controls', function (req, res) {
	var testData = [
		{ 'controlID': 1, 'securityControlNumber': 1, 'controlName': 'control1', 'description': 'This control does this!' },
		{ 'controlID': 2, 'securityControlNumber': 2, 'controlName': 'control2', 'description': 'This control does this!' }
	];
	var context = {};
	context.dataList = testData
	res.render('controls.handlebars', context);
});
*/

/*
app.get('/app_instances', function (req, res) {
	var testData = [
		{ 'appInstanceID': 1, 'workstationID': 1, 'appID': 1 },
		{ 'appInstanceID': 2, 'workstationID': 2, 'appID': 2 }
	];
	var context = {};
	context.dataList = testData
	res.render('app_instances.handlebars', context);
});
*/
/*
app.get('/control_instances', function (req, res) {
	var testData = [
		{ 'controlInstanceID': 1, 'controlID': 1, 'guideID': 1 },
		{ 'controlInstanceID': 2, 'controlID': 2, 'guideID': 2 }
	];
	var context = {};
	context.dataList = testData
	res.render('control_instances.handlebars', context);
});
*/
/*
app.get('/addresses', function (req, res) {
	var testData = [
		{ 'addressID': 1, 'ip': '192.168.1.2', 'workstationID': 1 },
		{ 'addressID': 2, 'ip': '192.168.1.3', 'workstationID': 2 },
		{ 'addressID': 3, 'ip': '192.168.1.4', 'workstationID': null }
	];
	var context = {};
	context.dataList = testData
	res.render('addresses.handlebars', context);
});
*/
/*
	LISTENER
*/
app.listen(app.get('port'), function () {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.')
});

