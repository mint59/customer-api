var router = require("express").Router();
var auth = require('../../lib/auth');

router.get("/:table", auth.optional, require("./get-list"));
router.get("/:table/:id", auth.optional, require("./get-detail"));
// router.post("/:table", auth.optional, require("./post"));
router.put("/:table/:id", auth.optional, require("./put"));

module.exports = router;