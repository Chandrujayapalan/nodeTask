const User = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const config = require('../config')
const register = async (req, res, next) => {
    try {
        let { name, email, phone, password , userType} = req.body

        // let userType is 1 = Admin
        // let usertype is 2  = User
        let user = await User.findOne({ $or: [{ email: email }, { phone: phone }] })
        if(!userType){
            userType = 1
        }
        if (!user) {
            let userData = new User({
                name: name,
                email: email,
                phone: phone,
                password: await bcrypt.hash(password, 10),
                userType: userType,
            })
            let user = await userData.save()
            return res.status(200).json({
                status: 200,
                message: 'Added successfully user',
                data: user
            })
        } else {
            return res.status(400).json({ status: 400, message: "Already exists" })
        }
    }
    catch (error) {
        return res.status(400).json({
            status: 400,
            err: " Something went Wrong",
            message: error.message
        })
    }
}
const login = async (req, res, next) => {
    try {
        let { username, password } = req.body
        let user = await User.findOne({ email: username })
        console.log(user)
        if (user) {
            var validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({
                    status: 400,
                    message: 'password does not match'
                })
            } else {
                let token = jwt.sign({ id: user.id, userType: user.userType }, config.secret , { expiresIn: '10d' })
                return res.status(200).json({
                    status: 200,
                    message: " login successfully by user",
                    userType: user.userType,
                    data: token
                })
            }
        } else {
            return res.json({
                status: 400,
                message: 'no user found '
            })
        }
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({
            status: 400,
            err: " Something went Wrong",
            message: error.message
        })
    }
}
const userList = async (req, res, next) => {
    try {
      
        let getUser = await User.find({userType : 2})
        
        if (!getUser.length) {
            return res.status(400).json({
                status: 400,
                message: 'no user found',

            })
        } else {
            return res.status(200).json({
                status: 200,
                message: 'data fetch successfully',
                data: getUser
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: 400,
            err: " Something went Wrong",
            message: error.message
        })
    }
}
module.exports = { register, login, userList }