const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const api = process.env.API_URL
const morgan = require('morgan')
const connectionDb = require('./db')
const productsRouter = require('./routes/productsRoute')
const categoriesRouter = require('./routes/categoriesRoute')
const usersRouter = require('./routes/usersRoute')


const authJwt = require('./helpers/jwt')
const errorHandler = require('./helpers/error-handler')


const app = express()


//middleware
app.use(express.json())  //dùng cho POST method
app.use(morgan('tiny'))
app.use(authJwt())
app.use(errorHandler)



//Routers
app.use(`${api}/categories`, categoriesRouter)
app.use(`${api}/products`, productsRouter)
app.use(`${api}/users`, usersRouter)


















const port = process.env.PORT || 5000
app.listen(port, async () => {
    try {
        await connectionDb
        console.log(`Database connected`)
    } catch (error) {
        console.log(error)
    }

    console.log(`Running on ${port}`)
})

//40:03 -> 4