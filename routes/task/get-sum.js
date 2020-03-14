const client = require("../../lib/db");

module.exports = async (req, res, next) => {
    try {
        const table = req.params.table;
        let query = `SELECT count(*)::INTEGER as "totalTask",`;
        query += ` coalesce(sum(case when status = 'O' then 1 else 0 end),0)::INTEGER as "totalOpen"`;
        // query += ` coalesce(sum(case when status = 'I' then 1 else 0 end),0)::INTEGER as "totalCheckIn",`;
        // query += ` coalesce(sum(case when status = 'C' then 1 else 0 end),0)::INTEGER as "totalComplete"`;
        query += ` FROM task`;
        // query += ` where ${tables[tableIdx].pk} = $1`;

        let response;
        let result = await client.query(query);
        response = result.rows[0];

        res.send(response);
    } catch (err) {
        next(err);
    }
};
