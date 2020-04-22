const client = require("../../lib/db");
// const s3 = require("../../lib/s3");
const dbTables = require("../../lib/db-tables");
var AWS = require('aws-sdk');
module.exports = async (req, res, next) => {
    try {
        console.log("req.params.table", req.params.table);
        console.log("req.params.id", req.params.id);
        const table = req.params.table;
        const id = req.params.id;
        const tables = await dbTables.getTables();
        const tableIdx = tables.findIndex(a => a.name === table);
        if (tableIdx === -1) {
            throw Error(`Invalid table ${table}`);
        }
        let query = `SELECT *`;
        query += ` FROM ${table}`;
        query += ` where ${tables[tableIdx].pk} = $1`;
        query += ` limit 1`;
        let response = {};
        let result = await client.query(query, [id]);
        if (result.rows.length < 1) {
            throw Error(`Not found file in ${table} with id ${id}`);
        }
        const s3 = new AWS.S3({
            accessKeyId: 'AKIAWBTXGZM5LWKRXEC3',
            signatureVersion: 'v4',
            region: 'ap-southeast-1',
            secretAccessKey: "RvdEi6+b84v9fWplF4iEP9kv3QVK6k02CFoCsWnE"
        });
        // RvdEi6+b84v9fWplF4iEP9kv3QVK6k02CFoCsWnE
        //   const myBucket = 'sratcha'
        //   const myKey = 'image-dc4277e8-a297-400f-bd47-0de4db0440b9.jpg'
        //   const signedUrlExpireSeconds = 60 * 1
        console.log("imagesss",result.rows[0].image);
        // 98a6e7fa-4fea-4e54-8449-b8126715b293
        var params = { Bucket: 'sratcha', Key: `${result.rows[0].image}` };
        s3.getObject(params, function(err, data){
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
            res.write(data.Body, 'binary');
            res.end(null, 'binary');
        }); 
        // const url = s3.getSignedUrl('getObject', {
        //     Bucket: myBucket,
        //     Key: myKey,
        //     "content-type": "application/octet-stream"
        // })
        // console.log(url)
        // let bucket = table.replace(/_/g, "-");
        // await minioClient.fGetObject(
        //     bucket,
        //     `${id}/${result.rows[0].file_name}`,
        //     `/tmp/${id}/${result.rows[0].file_name}`
        // );
        // console.log("success");
        // res.sendFile(`/tmp/${id}/${result.rows[0].file_name}`);
    } catch (err) {
        next(err);
    }
};