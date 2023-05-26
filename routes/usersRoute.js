const express = require('express')
const router = express.Router()
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()


// GET ALL
router.get('/', async (req, res) => {
    const userList = await User.find().select('-passwordHash')
    if(!userList) {
        res.status(500).json({ success: false })
    }
    res.send(userList)
})


// GET ID
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash')
    if(!user) {
        res.status(500).json({ message: 'The user with the given ID was not found' })
    }
    res.send(user)
})


// POST REGISTER
router.post('/register', async (req, res) => {
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(req.body.passwordHash, salt)

    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: hashedPassword,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save()

    if(!user) {
        return res.status(500).send('The user cannot be created')
    }
    return res.status(200).send(user)
})


// POST LOGIN
router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })

    if(!user) {
        return res.status(400).send('The user not found')
    }

    if(user && bcrypt.compareSync(req.body.passwordHash, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            process.env.SECRET_TOKEN,
        )

        return res.status(200).send({ message: 'User authenticated', email: user.email, token: token})
    } else {
        res.status(400).send('Password is wrong')
    }

    return res.status(200).send(user)

})


module.exports = router