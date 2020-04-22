let express = require('express');
let router = express.Router();
let upload = require('../../lib/multer.config');
 
const awsWorker = require('./aws.controller');
 
router.post('/api', upload.single("file"), awsWorker.doUpload);
// router.get("/image", auth.optional, require("./get.image"));
// router.get("/", auth.optional, require("../picture/get"));
 
module.exports = router;