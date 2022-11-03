const jwt = require('jsonwebtoken')
const config = require('../config');
const authenticating = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, config.secret)
        console.log(decode)
        req.user = decode
        next()
    }
    catch (error) {
        return res.status(403).json({
            status: 403,
            message: 'Authendication failed or token expried!'
        })
    }
}
const admin = (req, res, next) => {
    try {
        let check = req.user.userType
        if (check === 1) {
            next()
        } else {
            return res.status(403).json({
                status: 403,
                message: 'forbidden'
            })
        }
    }
    catch (error) {
        res.json({
            message: error
        })
    }
}
const user = (req, res, next) => {
    try {
        let check = req.user.userType
        if (check === 2) {
            next()
        } else {
            return res.status(403).json({
                status: 403,
                message: 'forbidden'
            })
        }
    }
    catch (error) {
        res.json({
            message: error
        })
    }
}
module.exports = { authenticating, admin, user }