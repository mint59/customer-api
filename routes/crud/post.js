const client = require("../../lib/db");
const dbColumns = require("../../lib/db-columns");
const commonColumns = require("../../lib/common-columns");
const uuid = require("uuid");
const dbTables = require("../../lib/db-tables");

module.exports = async (req, res, next) => {
    try {
        console.log("req.params.table", req.params.table);
        const table = req.params.table;
        const user = "tmp";
        const pgm = "crud-post";
        const id = uuid.v4();

        const tables = await dbTables.getTables();
        const columns = await dbColumns.getColumns(table);
        const tableIdx = tables.findIndex(a => a.name === table);
        if (tableIdx === -1) {
            throw Error(`Invalid table ${table}`);
        }
        const tableObj = tables[tableIdx];

        let queryCol = "";
        let queryVal = "";
        let valIdx = 1;
        let queryParams = [];

        queryCol += `${tableObj.pk}`;
        queryVal += `$${valIdx}`;
        valIdx++;
        queryParams.push(id);

        queryCol += `, created_by`;
        queryVal += `, $${valIdx}`;
        valIdx++;
        queryParams.push(user);

        queryCol += `, created_date`;
        queryVal += `, NOW()`;
        // valIdx++;
        // queryParams.push(user);

        queryCol += `, created_pgm`;
        queryVal += `, $${valIdx}`;
        valIdx++;
        queryParams.push(pgm);

        queryCol += `, updated_by`;
        queryVal += `, $${valIdx}`;
        valIdx++;
        queryParams.push(user);

        queryCol += `, updated_date`;
        queryVal += `, NOW()`;
        // valIdx++;
        // queryParams.push(user);

        queryCol += `, updated_pgm`;
        queryVal += `, $${valIdx}`;
        valIdx++;
        queryParams.push(pgm);

        for (prop in req.body) {
            if (commonColumns.findIndex(a => a.column_name === prop) > -1) {
                continue;
            }
            if (prop === tableObj.pk) {
                continue;
            }
            if (columns.findIndex(a => a.column_name === prop) > -1) {
                queryCol += `, ${prop}`;
                queryVal += `, $${valIdx}`;
                valIdx++;
                let param = req.body[prop];
                if (param === "") {
                    param = null;
                }
                queryParams.push(param);
            }
        }
        let query = `insert into ${table} (${queryCol}) values (${queryVal})`;

        let result = await client.query(query, queryParams);
        // console.log("result", result);

        query = `SELECT * FROM ${table}`;
        query += ` where ${tables[tableIdx].pk} = $1`;
        query += ` limit 1`;

        let response = {};
        result = await client.query(query, [id]);
        if (result.rows.length < 1) {
            throw Error(`Not found record in ${table} with id ${id}`);
        }
        response = result.rows[0];

        res.send(response);
    } catch (err) {
        next(err);
    }
};