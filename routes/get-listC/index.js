var router = require("express").Router();
var auth = require('../../lib/auth');

router.get("/:table/:id", auth.optional, require("./get-listC"));

module.exports = router;