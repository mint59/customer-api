var router = require("express").Router();

router.use("/crud", require("./crud"));
router.use("/task", require("./task"));

module.exports = router;