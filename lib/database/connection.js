var mysql   = require('mysql');
var nconf  = require('nconf');

var pool = mysql.createPool({
    host:                   nconf.get('mysql_host'),
    user:                   nconf.get('mysql_user'),
    password:               nconf.get('mysql_pswd'),
    port:                   nconf.get('mysql_port'),
    database:               nconf.get('mysql_database'),
    createConnection:       mysql.createConnection,
    waitForConnections:     true,
    connectionLimit:        nconf.get('mysql_connection_limit')
});

var getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
};

module.exports = getConnection;