const client = require("../../lib/db");
const dbColumns = require("../../lib/db-columns");
const commonColumns = require("../../lib/common-columns");
const dbTables = require("../../lib/db-tables");
const bcrypt = require("bcryptjs");

module.exports = async (req, res, next) => {
    try {
        console.log("req.params.table", req.params.table);
        console.log("req.params.id", req.params.id);
        const table = req.params.table;
        const id = req.params.id;
        const user = "tmp";
        const pgm = "crud-put";

        const tables = await dbTables.getTables();
        const columns = await dbColumns.getColumns(table);
        const tableIdx = tables.findIndex(a => a.name === table);
        if (tableIdx === -1) {
            throw Error(`Invalid table ${table}`);
        }
        const tableObj = tables[tableIdx];

        let query = `update ${table} set`;
        let valIdx = 1;
        let queryParams = [];

        query += ` updated_by = $${valIdx}`;
        valIdx++;
        queryParams.push(user);

        query += `, updated_date = NOW()`;

        query += `, updated_pgm = $${valIdx}`;
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
                query += `, ${prop} = $${valIdx}`;
                valIdx++;
                let param = req.body[prop];
                if (prop == "password") {
                    param = bcrypt.hashSync(param, 12);
                }
                if (param === "") {
                    param = null;
                }
                queryParams.push(param);
            }
        }
        query += ` where ${tableObj.pk} = $${valIdx}`;
        valIdx++;
        queryParams.push(id);

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