var router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/crud", require("./crud"));
router.use("/task", require("./task"));
router.use("/picture", require("./picture"));
router.use("/get-listO", require("./get-listO"));
router.use("/get-listI", require("./get-listI"));
router.use("/get-listC", require("./get-listC"));

module.exports = router;