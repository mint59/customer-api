var router = require("express").Router();
var auth = require('../../lib/auth');

router.get("/task-sum/:id", auth.optional, require("./get-sum"));

module.exports = router;