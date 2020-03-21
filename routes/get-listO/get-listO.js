const client = require("../../lib/db");
const createFilter = require("odata-v4-pg").createFilter;
const dbColumns = require("../../lib/db-columns");
const dbTables = require("../../lib/db-tables");

module.exports = async (req, res, next) => {
    try {
        console.log("req.query.$skip", req.query.$skip);
        console.log("req.params.id", req.params.id);

        let top = req.query.$top;
        if (!top || top > 1000) {
            top = 1000;
        }
        let skip = req.query.$skip;
        if (!skip || skip < 0) {
            skip = 0;
        }

        let filter;
        try {
            filter = createFilter(req.query.$filter);
        } catch (error) {
            throw Error(`Invalid filter ${req.query.$filter}`);
        }
        const id = req.params.id;

        const table = req.params.table;
        const tables = await dbTables.getTables();

        const tableIdx = tables.findIndex(a => a.name === table);
        if (tableIdx === -1) {
            throw Error(`Invalid table ${table}`);
        }

        let queryParams = filter.parameters;
        let query = `SELECT * FROM ${table}`;
        query += ` where status = 'O' `;
        query += ` and sys_user_id = $1 `

        let queryCount = `SELECT count(*) FROM ${table}`;

        let response = {};
        let result = await client.query(query, [id]);
        response.rows = result.rows;

        let resultCount = await client.query(queryCount);
        response.totalCount = parseInt(resultCount.rows[0].count);
        res.send(response);

    } catch (err) {
        next(err);
    }
};
