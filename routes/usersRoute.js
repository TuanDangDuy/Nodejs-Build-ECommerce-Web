const express = require('express')
const router = express.Router()
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')

router.get('/', async (req, res) => {
    const userList = await new User.find()
    if(!userList) {
        res.status(500).json({ success: false })
    }
    res.send(userList)
})

router.post('/', async (req, res) => {
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(req.body.password, salt)

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

module.exports = router