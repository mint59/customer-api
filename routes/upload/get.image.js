// const awsConfig = require('../../lib/aws-client');
// const AWS = require('aws-sdk');

// router.get('/export', function(req, res, next) {
//     const file = 'df.csv';
//     console.log('Trying to download file', fileKey);

//     const s3 = new AWS.S3({});

//     const options = {
//         Bucket: 'sratcha',
//         Key: file,
//     };

//     s3.getObject(options, function(err, data) {
//       res.attachment(file);
//       res.send(data.Body);
//   });
// });