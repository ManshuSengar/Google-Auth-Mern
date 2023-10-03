const jwt = require('jsonwebtoken');
const UserModel = require('../models/User.model');

async function authorizeUserMiddleware(req, res, next) {
    try {
        const token = extractTokenFromHeader(req.headers.authorization);

        if (!token) {
            return sendUnauthorized(res);
        }

        const decodedToken = await verifyToken(token);

        const user = await findUserByEmail(decodedToken.email);

        if (!user) {
            return sendUnauthorized(res);
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in authorizeUserMiddleware:", error);
        sendInternalServerError(res);
    }
}

function extractTokenFromHeader(authorizationHeader) {
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return null;
    }

    return authorizationHeader.split(' ')[1];
}

function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                reject(err);
            } else {
                resolve(decodedToken);
            }
        });
    });
}

async function findUserByEmail(email) {
    return UserModel.findOne({ email });
}

function sendUnauthorized(res) {
    return res.status(401).json({ message: 'Unauthorized' });
}

function sendInternalServerError(res) {
    return res.status(500).json({ message: 'Internal Server Error' });
}

module.exports = { authorizeUserMiddleware };
