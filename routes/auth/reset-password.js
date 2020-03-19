module.exports = async (req, res, next) => {
    try {
        console.log("post");
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
};
