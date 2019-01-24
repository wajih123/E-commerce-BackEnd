const mongoose = require('mongoose')
const Category = mongoose.model('Category')
const User = mongoose.model('User')
module.exports = (app) => {
    /**
     * @api {get} /categories Request category list
     * @apiName GetCategories  
     * @apiGroup Categories 
     * 
     * @apiHeader (Operator) {String} token
     */
    app.get('/categories', (req, res) => {

        User.checkToken(req.headers.token, (err, user) => {
            if (!user) {
                return res.send(401)
            }
            return Category.find().exec((err, result) => {
                if (err) return res.send(400, err)
                return res.send(200, { result })
            })
        })
    })

    /**
     * @api {get} /categories/:_id Request specific category
     * @apiName GetCategory
     * @apiGroup Categories 
     * 
     * @apiHeader (Operator) {String} token
     * 
     * @apiParam (Operator) {String} id 
     */
    app.get('/categories/:_id', (req, res) => {
        User.checkToken(req.headers.token, (err, user) => {
            if (!user) {
                return res.send(401)
            }
            return Category.findById(req.params._id).exec((err, result) => {
                if (err) return res.send(400, err)
                return res.send(200, { result })
            })
        })
    })

    /**
     * @api {post} /categories Create new category
     * @apiName CreateCategory
     * @apiGroup Categories 
     * 
     * @apiHeader (Admin) {String} token
     *
     * @apiParam (Admin) {String} name
     */
    app.post('/categories', (req, res) => {
       
        User.isAdmin(req.headers.token, (err, user) => {
            if (!user) {
                return res.send(401)
            }

            const category = new Category(req.body.category)
            category.save((err, result) => {
                if (err) return res.send(400, err)
                return res.send(201, { result })
            })
        })
    })

    /**
     * @api {put} /categories/:_id Edit a category
     * @apiName EditCategory
     * @apiGroup Categories 
     * 
     * @apiHeader (Admin) {String} token
     * 
     * @apiParam (Admin) {String} id
     * @apiParam (Admin) {String} [name]
     */
    app.put('/categories/:_id', (req, res) => {
        User.isAdmin(req.headers.token, (err, user) => {
            if (!user) {
                return res.send(401)
            }
            return Category.findById(req.params._id).exec((err, result) => {
                if (err) return res.send(400, err)
                result.name = req.body.name
                result.save((err, result) => {
                    if (err) return res.send(400, err)
                    return res.send(200, { result })
                })
            })
        })
    })

    /**
     * @api {delete} /categories/:_id Delete a category
     * @apiName DeleteCategory
     * @apiGroup Categories 
     * 
     * @apiHeader (Admin) {String} token
     * 
     * @apiParam (Admin) {String} id
     */
    app.delete('/categories/:_id', (req, res) => {
        User.isAdmin(req.headers.token, (err, user) => {
            if (!user) {
                return res.send(401)
            }
            return Category.remove({_id: req.params._id}, function(err) {
                if (err) return res.send(400, err)
                return res.send(204)
            })
        })
    })
}