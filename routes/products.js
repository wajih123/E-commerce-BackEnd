const mongoose = require('mongoose')
const Product = mongoose.model('Product')
const Category = mongoose.model('Category')
const User = mongoose.model('User')

module.exports = (app) => {
    /**
     * @api {get} /products Request product list
     * @apiName GetProducts  
     * @apiGroup Products 
     * 
     * @apiHeader (Operator) {String} token
     * 
     * @apiParam (Operator) {String[]} [categories]
     * @apiParam (Operator) {Boolean} [available_stock]
     */
    app.get('/products', (req, res) => {
        User.checkToken(req.headers.token, (err, user) => {
            if (!user) {
                return res.send(401)
            }
            let conditions = {}
            if (req.query.categories) {
                conditions.categories = {$all: req.query.categories.split(',')}
            }
            if (!!req.query.availableOnly) {
                conditions.available_stock = {$gt: 0}
            }
            return Product.find(conditions).exec((err, result) => {
                if (err) return res.send(400, err)
                return res.send(200, { result })
            })
        })
    })

    /**
     * @api {get} /products/:_id Request specific product
     * @apiName GetProduct  
     * @apiGroup Products 
     * 
     * @apiHeader (Operator) {String} token
     * 
     * @apiParam (Operator) {String} id 
     */
    app.get('/products/:_id', (req, res) => {
        User.checkToken(req.headers.token, (err, user) => {
            if (!user) {
                return res.send(401)
            }
            return Product.findById(req.params._id).exec((err, result) => {
                if (err) return res.send(400, err)
                return res.send(200, { result })
            })
        })
    })

    /**
     * @api {post} /products Create new product
     * @apiName CreateProduct  
     * @apiGroup Products 
     * 
     * @apiHeader (Admin) {String} token
     * 
     * @apiParam (Admin) {String} name
     * @apiParam (Admin) {String[]} [categories]
     * @apiParam (Admin) {Number} [available_stock=0]
     * @apiParam (Admin) {Number} price
     */
    app.post('/products', (req, res) => {
        User.isAdmin(req.headers.token, (err, user) => {
            if (!user) {
                return res.send(401)
            }
            var product = req.body.product;
            if (typeof product.categories === 'string') {
                product.categories = product.categories.split(',')
            }
            else if (typeof product.categories === 'object') {
                product.categories = product.categories
            } else {
                product.categories = []
            }
            product = new Product(product)
            console.log(req.body.product, product, typeof req.body.product.categories)
            product.created_by = user._id 
            product.save((err, result) => { 
                if (err) return res.send(400, err)
                return res.send(201, { result })
            })
        });
    })
    

    /**
     * @api {put} /products/:_id Edit a product
     * @apiName EditProduct  
     * @apiGroup Products 
     * 
     * @apiHeader (Admin) {String} token
     * 
     * @apiParam (Admin) {String} id
     * @apiParam (Admin) {String} [name]
     * @apiParam (Admin) {String[]} [categories]
     * @apiParam (Admin) {Number} [available_stock=0]
     * @apiParam (Admin) {Number} [price]
     */
    app.put('/products/:_id', (req, res) => {
        User.isAdmin(req.headers.token, (err, user) => {
            if (!user) {
                return res.send(401)
            }
            return Product.findById(req.params._id).exec((err, result) => {
                if (err) return res.send(400, err)
                console.log(req.body)
                if (typeof req.body.categories === 'string') {
                    result.categories = req.body.categories.split(',')
                }
                if (typeof req.body.categories === 'object') {
                    result.categories = req.body.categories
                }
                result.name = req.body.name
                result.available_stock = req.body.available_stock
                result.price = req.body.price
                result.save((err, result) => {
                    if (err) return res.send(400, err)
                    return res.send(200, { result })
                })
            })
        })
    })

    /**
     * @api {delete} /products/:_id Delete a product
     * @apiName DeleteProduct  
     * @apiGroup Products 
     * 
     * @apiHeader (Admin) {String} token
     * 
     * @apiParam (Admin) {String} id
     */
    app.delete('/products/:_id', (req, res) => {
        User.isAdmin(req.headers.token, (err, user) => {
            if (!user) {
                return res.send(401)
            }
            return Product.remove({_id: req.params._id}, function(err) {
                if (err) return res.send(400, err)
                return res.send(204)
            })
        })
    })
}