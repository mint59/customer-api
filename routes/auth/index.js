var router = require("express").Router();
var auth = require('../../lib/auth');

router.post("/", require("./signon"));
// router.post("/register", require("./register"));
// router.post("/reset-password", auth, require("./reset-password"));
// router.get("/menu", auth, require("./menu"));

module.exports = router;