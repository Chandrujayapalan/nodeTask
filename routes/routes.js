const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const controller = require('../controller/controller')

router.post('/register', controller.register)
router.post('/login', controller.login)
router.get('/user', [auth.authenticating , auth.admin], controller.userList)
module.exports = router 