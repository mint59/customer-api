let express = require('express');
let router = express.Router();
var auth = require('../../lib/auth'); 

router.get("/:table/:id", auth.optional, require("./get"));
 
module.exports = router;