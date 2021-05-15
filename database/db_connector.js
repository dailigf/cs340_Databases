// ./database/db_connector.js

// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'database-1.cckea77oooke.ap-northeast-2.rds.amazonaws.com',
    user            : 'walshda',
    password        : 'password',
    database        : 'cs340_Project'
})


// Export it for use in our applicaiton
module.exports.pool = pool;
