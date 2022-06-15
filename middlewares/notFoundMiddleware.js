const notFound = (req, res) => {
    console.log(req.path);
    res.status(404).end();
};

module.exports = notFound;