const express = require('express')
const router = express.Router()
const Category = require('../models/categoryModel')


// GET ALL
router.get('/', async (req, res) => {
    const categoryList = await Category.find({})

    if(!categoryList) {
        res.status(500).json({ success: false })
    }
    res.status(200).send(categoryList)
})


// GET ID
router.get('/:id', async (req, res) => {
     const category = await Category.findById(req.params.id)
     if(!category) {
        res.status(500).json({ message: 'The category with the given ID was not found' })
     }
     res.status(200).send(category)
})


// POST
router.post('/', async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    category = await category.save()

    if(!category) return res.status(404).send('The category cannot created')

    res.send(category)
})


// PUT ID
router.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id, 
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        },
        { new: true }  //có dòng này mới thấy được nó update, get ra là thấy có updated
    )

    if(!category) return res.status(404).send('The category cannot updated')
    res.send(category)
})


// DELETE ID
router.delete('/:id', async (req, res) => {
    Category.findByIdAndRemove(req.params.id)
        .then((category) => {
            if(category) {
                return res.status(200).json({ success: true, message: 'The category is deleted!' })
            } else {
                return res.status(404).json({ success: false, message: 'category not found' })
            }
        })
        .catch((err) => {
            return res.status(400).json({ success: false, error: err })
        })

})

module.exports = router