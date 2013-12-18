/*
    Configuration example
 */

module.exports = {
    /* Server: */
    'port': 1337,
    'https': false,
    'ssl_cert': '',

    /* Database: */
    'mysql_host': 'localhost',
    'mysql_port': '8889',
    'mysql_user': '',
    'mysql_pswd': '',
    'mysql_database': '',
    'table_prefix': '',

    /* Admin/Site: */
    'folder_public': 'public',
    'folder_admin': 'admin',
    'folder_site': 'site',
    'path_admin': 'administrator',
    'path_site': 'site',

    /* Default state value: */
    'state_limit': 100,

    'default_format': 'json',
    'param_component': 'component',
    'param_view': 'view',
    'param_format': 'format'
};