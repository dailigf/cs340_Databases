// ./database/db_connector.js

// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'francisdailig',
    password        : 'tlIm$I$nw23',
    database        : 'cs340_dailigf'
})


// Export it for use in our applicaiton
module.exports.pool = pool;
