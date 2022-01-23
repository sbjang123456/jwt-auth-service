'use strict'

const jsonwebtoken = require('jsonwebtoken');
const JWT_SECRET = 'sbjangTest';
const ACCESS_TOKEN_EXPIRE = '5m';
const REFRESH_TOKEN_EXPIRE = '6h';

const verifyToken = (req, res, next) => {
    try {
        const clientToken = req.headers.access_token || req.query.access_token;
        const decoded = jsonwebtoken.verify(clientToken, JWT_SECRET);
        if (decoded) {
            res.status(200).json({
                valid: true
            });
        } else {
            res.status(401).json({valid: false, error: 'unauthorized'});
        }
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            res.status(419).json({ valid: false, error: 'token expired' });
        } else {
            res.status(401).json({ valid: false, error: 'unauthorized' });
        }
    }
};

const issueToken = (req, res, next) => {
    const accessToken = jsonwebtoken.sign({
        user_id: 'sbjang',
        email: 'sbjang@test.com',
    }, JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRE,
        issuer: 'authUser',
    });
    const refreshToken = jsonwebtoken.sign({
        user_id: 'sbjang',
        email: 'sbjang@test.com',
    }, JWT_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRE,
        issuer: 'authUser',
    });

    res.status(201).json({
        access_token: accessToken,
        refresh_token: refreshToken
    });
};

const reissueToken = (req, res, next) => {
    try {
        const refreshToken = req.headers.refresh_token || req.query.refresh_token;
        const decoded = jsonwebtoken.verify(refreshToken, JWT_SECRET);
        if (decoded) {
            const accessToken = jsonwebtoken.sign({
                user_id: decoded.user_id,
                email: decoded.email,
            }, JWT_SECRET, {
                expiresIn: ACCESS_TOKEN_EXPIRE,
                issuer: 'authUser',
            });
            res.status(201).json({
                access_token: accessToken,
                refresh_token: refreshToken
            });
        } else {
            res.status(401).json({ error: 'unauthorized' });
        }
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            res.status(419).json({ error: 'token expired' });
        } else {
            res.status(401).json({ error: 'unauthorized' });
        }
    }
};

module.exports = {
    verifyToken,
    issueToken,
    reissueToken
};