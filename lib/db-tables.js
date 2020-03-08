const client = require("./db");

module.exports.getTables = async () => {
    let query = `select table_name as name, concat(table_name,'_id') as pk`;
    query += ` FROM information_schema.tables`;
    query += ` where table_schema = 'public'`;
    let result = await client.query(query);
    return result.rows;
};