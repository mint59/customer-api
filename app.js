const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(require("cors")());
app.use(require("morgan")("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require("method-override")());
app.use(require("./routes"));


app.use(function(req, res, next) {
    var err = new Error("not found");
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    const uuid = require("uuid").v4();
    console.log(uuid, err);
    // console.log("[" + uuid + "]" + err);
    res.status(err.status || 500);
    res.json({
        errors: {
            id: uuid,
            message: err.message
        }
    });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));