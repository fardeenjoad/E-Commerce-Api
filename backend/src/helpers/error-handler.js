function erroHandler(err, req, res, next) {
    if(err.name === 'UnauthorizedError'){
        // jwt authentication error
       return res.status(401).send({message: "The user is not authorized"})
      }

    if(err.name === 'ValidationError'){
        // mongoose validation error
        return res.status(400).send({message: err})
    }

    // default to 500 server error
    return res.status(500).send({message: err.message})
}

module.exports = erroHandler