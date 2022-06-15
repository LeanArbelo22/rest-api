const errorHandler = (error, request, response, next) => {
    console.error(error.message);
    if(error.name === 'CastError'){
        response.status(400).send({ error: 'Invalid parameter id'});
    } else {
        response.status(500).end();
        next(); // !!
    } 
};

module.exports = errorHandler;