const logger = (req, res, next) => {
    console.log('Method: ' + req.method);
    console.log('Path: ' + req.path);
    console.log(`Body: ${JSON.stringify(req.body)}`);
    console.log('--------------------');
    next();
};

module.exports = logger;