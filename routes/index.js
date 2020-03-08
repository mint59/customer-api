var router = require("express").Router();

router.use("/crud", require("./crud"));

module.exports = router;