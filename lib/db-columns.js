const client = require("./db");

module.exports.getColumns = async table => {
    let query = `SELECT column_name, udt_name`;
    query += ` FROM information_schema.columns`;
    query += ` WHERE table_schema = 'public'`;
    query += ` AND table_name  = $1`;
    let result = await client.query(query, [table]);
    return result.rows;
};