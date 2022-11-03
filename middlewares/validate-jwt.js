require('dotenv').config();
const jwt = require('jsonwebtoken');

const validateJWT = (req, res, next) => {
    try {
        const token = req.header('x-token');

        if(!token) {
            return res.status(401).json({
                ok: false,
                message: 'There is no token'
            });
        }

        req.token = jwt.verify(token, process.env.JWT_SECRET);

        next();
    } catch(err) {
        res.status(500).json({
            ok: false,
            message: 'Invalid token.'
        });
    }
}

module.exports = {
    validateJWT
}