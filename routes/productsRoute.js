const express = require('express')
const router = express.Router()
const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const mongoose = require('mongoose')


// router.get('/', async (req, res) => {
//     const productList = await Product.find().populate('category')
    
//     if(!productList) {
//         res.status(500).json({ success: false })
//     }
//     res.send(productList)
// })

//filter, lọc sản phẩm thông qua categories
router.get('/', async (req, res) => {
    let filter = {}
    if(req.query.categories) {
        filter = { category: req.query.categories.split('')}
    }
    const productList = await Product.find().populate('category')
    
    if(!productList) {
        res.status(500).json({ success: false })
    }
    res.send(productList)
})

router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category')   //id trong dòng này là id của products
    console.log(Product)
    if(!product) {
        res.status(500).json({ success: false })
    }
    res.send(product)
})

router.post('/', async (req, res) => {
    const category = await Category.findById(req.body.category)
    if(!category) {
        return res.status(400).send('Invalid category')
    }

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        band: req.body.band,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    })

    product = await product.save()
    if(!product) {
        return res.status(500).send('The product cannot be created')
    }
    return res.status(200).send(product)
})

router.put('/:id', async (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Product ID')
    }

    const category = await Category.findById(req.body.category)
    if(!category) {
        return res.status(400).send('Invalid category')
    }

    const product = await Product.findByIdAndUpdate(
        req.params.id, 
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            band: req.body.band,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
        },
        { new: true }  //có dòng này mới thấy được nó update, get ra là thấy có updated
    )

    if(!product) return res.status(404).send('The product cannot updated')
    res.send(product)
})

router.delete('/:id', async (req, res) => {
    Product.findByIdAndRemove(req.params.id)
        .then((product) => {
            if(product) {
                return res.status(200).json({ success: true, message: 'The category is deleted!' })
            } else {
                return res.status(404).json({ success: false, message: 'category not found' })
            }
        })
        .catch((err) => {
            return res.status(400).json({ success: false, error: err })
        })

})

//đếm tổng số sản phẩm
router.get('/get/count', async (req, res) => {
    const productCount = await Product.countDocuments((count) => count)

    if(!productCount) {
        res.status(500).json({ success: false })
    }
    res.send({ productCount: productCount })
})

// //lấy ra product khi có isFeatured: true
// router.get('/get/featured', async (req, res) => {
//     const products = await Product.find({ isFeatured: true })

//     if(!products) {
//         res.status(500).json({ success: false })
//     }
//     res.send(products)
// })

//lấy ra product khi có isFeatured: true, giới hạn lại vài sản phẩm nhất định
router.get('/get/featured/:count', async (req, res) => {
    const count = req.params.count ? req.params.count : 0
    const products = await Product.find({ isFeatured: true }).limit(+count)

    if(!products) {
        res.status(500).json({ success: false })
    }
    res.send(products)
})

module.exports = router