require('dotenv').config()
const { expressjwt: expressJwt } = require('express-jwt');

function authJwt () {
    const secret = process.env.SECRET_KEY;
    return expressJwt ({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            // public routes that don't require authentication
           
           { url: /\/api\/product(.*)/, method: ['GET', 'OPTIONS'] },
           { url: /\/api\/categories(.*)/, method: ['GET', 'OPTIONS']},
           { url: /\/api\/users(.*)/, method: ['GET', 'OPTIONS']},
           '/api/users/login',
           '/api/users/register',
            
        ]
    })
}

async function isRevoked (req, payload, done){
    if(!payload.isAdmin){
        done:{
            null, true
        } 
    }
    done
}

module.exports = authJwt;