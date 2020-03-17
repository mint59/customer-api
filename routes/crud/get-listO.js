const client = require("../../lib/db");
const createFilter = require("odata-v4-pg").createFilter;
const dbColumns = require("../../lib/db-columns");
const dbTables = require("../../lib/db-tables");

module.exports = async (req, res, next) => {
    try {
        console.log("req.query.$skip", req.query.$skip);

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
            // console.log("filter", filter);
        } catch (error) {
            throw Error(`Invalid filter ${req.query.$filter}`);
        }

        const table = req.params.table;
        const tables = await dbTables.getTables();
        const columns = await dbColumns.getColumns(table);
        const tableIdx = tables.findIndex(a => a.name === table);
        if (tableIdx === -1) {
            throw Error(`Invalid table ${table}`);
        }

        let queryParams = filter.parameters;
        let query = `SELECT * FROM ${table}`;
        query += ` where status = 'O' `;
        // query += ` order by ${column}`;
        query += ` limit ${top} offset ${skip}`;

        // let response = {};
        // let result = await client.query(query, queryParams);
        // response.rows = result.rows;

        let queryCount = `SELECT count(*) FROM ${table}`;
        // let resultCount = await client.query(queryCount);
        // // response.totalCount = parseInt(resultCount.rows[0].count);
        // response.totalCount = response.rows.length;

        let response = {};
        let result = await client.query(query, queryParams);
        response.rows = result.rows;

        let resultCount = await client.query(queryCount, queryParams);
        response.totalCount = parseInt(resultCount.rows[0].count);

        res.send(response);

        // let queryCount = `SELECT count(*) FROM ${table}`;
        // queryCount += ` where ${filter.where}`;

        // let resultCount = await client.query(queryCount, queryParams);
        // response.totalCount = parseInt(resultCount.rows[0].count);

    } catch (err) {
        next(err);
    }
};


// const client = require("../../lib/db");
// const createFilter = require("odata-v4-pg").createFilter;
// const dbColumns = require("../../lib/db-columns");
// const dbTables = require("../../lib/db-tables");

// module.exports = async (req, res, next) => {
//     try {
//         console.log("req.params.table", req.params.table);
//         console.log("req.query.$top", req.query.$top);
//         console.log("req.query.$skip", req.query.$skip);
//         console.log("req.query.$orderby", req.query.$orderby);
//         console.log("req.query.$filter", req.query.$filter);
//         console.log("req.query.$join", req.query.$join);
//         console.log("req.query.$joinct", req.query.$joinct);
//         console.log("req.query.$fts", req.query.$fts);

//         const table = req.params.table;
//         const orderby = req.query.$orderby;
//         const join = req.query.$join;
//         const joinct = req.query.$joinct;
//         const fts = req.query.$fts;

//         let top = req.query.$top;
//         if (!top || top > 1000) {
//             top = 1000;
//         }
//         let skip = req.query.$skip;
//         if (!skip || skip < 0) {
//             skip = 0;
//         }

//         let filter;
//         try {
//             filter = createFilter(req.query.$filter);
//             // console.log("filter", filter);
//         } catch (error) {
//             throw Error(`Invalid filter ${req.query.$filter}`);
//         }

//         const tables = await dbTables.getTables();
//         const columns = await dbColumns.getColumns(table);
//         const tableIdx = tables.findIndex(a => a.name === table);
//         if (tableIdx === -1) {
//             throw Error(`Invalid table ${table}`);
//         }

//         let queryParams = filter.parameters;
//         let query = `SELECT * `;
//         if (join) {
//             const joinArr = join.split(",");
//             for (const joinObj of joinArr) {
//                 const arr = joinObj.split(" ");
//                 console.log("arr".arr);
//                 if (arr.length !== 3) {
//                     throw Error(`incomplete join ${joinObj}`);
//                 }
//                 const joinTable = arr[0];
//                 const joinColumn = arr[1];
//                 const joinValues = arr[2];

//                 if (tables.findIndex(a => a.name === joinTable) === -1) {
//                     throw Error(`Invalid join table ${joinTable}`);
//                 }
//                 if (
//                     columns.findIndex(a => a.column_name === joinColumn) === -1
//                 ) {
//                     throw Error(`Invalid join column ${joinColumn}`);
//                 }

//                 const joinValuesArr = joinValues.split("|");
//                 const joinColumns = await dbColumns.getColumns(joinTable);

//                 let concat = "concat(";
//                 for (let [index, joinValue] of joinValuesArr.entries()) {
//                     if (
//                         joinColumns.findIndex(
//                             a => a.column_name === joinValue
//                         ) === -1
//                     ) {
//                         throw Error(`Invalid join column ${joinValue}`);
//                     }
//                     if (index > 0) {
//                         concat += " , ' ',";
//                     }
//                     concat += joinValue;
//                 }
//                 concat += " )";

//                 const newColumn = `${joinTable}_${joinValuesArr.join("_")}`;
//                 query += ` , (select ${concat} from ${joinTable} where ${table}.${joinColumn} = ${joinTable}_id limit 1)`;
//                 query += ` as ${newColumn}`;
//             }
//         }
//         if (joinct) {
//             const joinArr = joinct.split(",");
//             for (const joinObj of joinArr) {
//                 const arr = joinObj.split(" ");
//                 console.log("arr".arr);
//                 if (arr.length !== 2) {
//                     throw Error(`incomplete joinct ${joinObj}`);
//                 }
//                 const joinCode = arr[0];
//                 const joinColumn = arr[1];

//                 if (
//                     columns.findIndex(a => a.column_name === joinColumn) === -1
//                 ) {
//                     throw Error(`Invalid joinct column ${joinColumn}`);
//                 }

//                 const newColumn = `${joinColumn}_code_table`;
//                 query += ` , (select description1 from code_table`;
//                 query += ` where public."${table}".${joinColumn} = code_value and code_table_code = '${joinCode}' limit 1)`;
//                 query += ` as ${newColumn}`;
//             }
//         }
//         query += ` FROM public."${table}"`;
//         query += ` where ${filter.where}`;

//         let queryCount = `SELECT count(*) FROM public."${table}"`;
//         queryCount += ` where ${filter.where}`;

//         if (fts) {
//             query += ` and to_tsvector(${table}::text) @@ to_tsquery($${filter
//                 .parameters.length + 1})`;
//             queryCount += ` and to_tsvector(${table}::text) @@ to_tsquery($${filter
//                 .parameters.length + 1})`;
//             queryParams.push(fts + ":*");
//         }

//         if (orderby) {
//             const orderbyArr = orderby.split(",");
//             for (const orderbyObj of orderbyArr) {
//                 let arr = orderbyObj.split(" ");
//                 if (arr.length < 1 || arr.length > 2) {
//                     throw Error(`Invalid orderby ${orderbyObj}`);
//                 }
//                 if (columns.findIndex(a => a.column_name === arr[0]) === -1) {
//                     throw Error(`Invalid orderby column ${arr[0]}`);
//                 }
//                 if (
//                     arr[1] &&
//                     arr[1].toLowerCase() !== "asc" &&
//                     arr[1].toLowerCase() !== "desc"
//                 ) {
//                     throw Error(`Invalid orderby order ${orderbyObj}`);
//                 }
//             }
//             query += ` order by ${orderby}`;
//         }
//         query += ` limit ${top} offset ${skip}`;

//         let response = {};
//         let result = await client.query(query, queryParams);
//         response.rows = result.rows;

//         let resultCount = await client.query(queryCount, queryParams);
//         response.totalCount = parseInt(resultCount.rows[0].count);

//         res.send(response);
//     } catch (err) {
//         next(err);
//     }
// };