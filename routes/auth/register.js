const client = require("../../lib/db");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");


module.exports = async (req, res, next) => {
    try {
        const user = "tmp";
        const pgm = "register";

        let queryCol = "";
        let queryVal = "";
        let valIdx = 1;
        let queryParams = [];

        queryCol += ` sys_user_id`;
        queryVal += `$${valIdx}`;
        valIdx++;
        queryParams.push(uuid.v4());

        queryCol += `, created_by`;
        queryVal += `, $${valIdx}`;
        valIdx++;
        queryParams.push(user);

        queryCol += `, created_date`;
        queryVal += `, NOW()`;

        queryCol += `, created_pgm`;
        queryVal += `, $${valIdx}`;
        valIdx++;
        queryParams.push(pgm);



        for (prop in req.body) {
            queryCol += `, ${prop}`;
            queryVal += `, $${valIdx}`;
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

        let check = `select * from sys_user where username = ($1)`;
        let checkresult = await client.query(check, [req.body.username]);

        if (checkresult.rowCount != 0) {
            next(new Error('User already exists!'));
        } else {
            let query = `insert into sys_user (${queryCol}) values (${queryVal})`;
            let result = await client.query(query, queryParams);
            res.status(204).send();
        }

    } catch (err) {
        next(err);
    }
};