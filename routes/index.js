var router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/crud", require("./crud"));
router.use("/task", require("./task"));

router.use("/picture", require("./picture"));

module.exports = router;