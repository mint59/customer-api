const { Pool, types } = require("pg");

// correct usage: create the pool and let it live
// 'globally' here, controlling access to it through exported methods

types.setTypeParser(types.builtins.NUMERIC, value => {
    return parseFloat(value);
});

const config = {
    user: "fbcatuyw",
    password: "et7n8rjQiUr7a7CW1af1Gj1ugED0v5Zf",
    host: "arjuna.db.elephantsql.com",
    port: "5432",
    database: "fbcatuyw",
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    types: types
};

const pool = new Pool(config);

// this is the right way to export the query method
module.exports.query = async (text, values) => {
    console.log("query:", text, values);
    return pool.query(text, values);
};