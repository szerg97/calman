const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next){
    //GET token from Header
    const token = req.header('x-auth-token');

    //CHECK if no token
    if(!token){
        return res.status(401).json({msg: 'No token, auth failed.'});
    }

    //VERIFY token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({msg: 'Token is not valid'});
    }
}