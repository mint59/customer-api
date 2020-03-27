let express = require('express');
let router = express.Router();
let upload = require('../../lib/multer.config');
 
const awsWorker = require('./aws.controller');
 
router.post('/api', upload.single("file"), awsWorker.doUpload);
 
module.exports = router;