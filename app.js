const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const api = process.env.API_URL
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const productsRouter = require('./routes/productsRoute')
const categoriesRouter = require('./routes/categoriesRoute')

const app = express()

//middleware
app.use(bodyParser.json())  //dùng cho POST method
app.use(morgan('tiny'))




//Routers
app.use(`${api}/products`, productsRouter)
app.use(`${api}/categories`, categoriesRouter)
















mongoose.connect(process.env.CONNECTION_STRING)
        .then((e) => {
            console.log(`Database connected to ${e.connection.host}`)
        })
        .catch((err) => {
            console.log(err)
        })

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Running on ${port}`)
})

//40:03 -> 4