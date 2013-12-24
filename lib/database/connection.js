var mysql   = require('mysql');
var config  = require(process.cwd() + '/configuration.js');

var pool = mysql.createPool({
    host:                   config.mysql_host,
    user:                   config.mysql_user,
    password:               config.mysql_pswd,
    port:                   config.mysql_port,
    database:               config.mysql_database,
    createConnection:       mysql.createConnection,
    waitForConnections:     true,
    connectionLimit:        10
});

var getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
};

module.exports = getConnection;