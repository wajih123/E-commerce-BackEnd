const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = (app) => {
    /**
     * @api {post} /users Create new user 
     * @apiName CreateUser  
     * @apiGroup Users 
     * 
     * @apiParam {String} name
     */
    app.post('/users', (req, res) => {
        const user = new User({name: req.body.name})
        user.save((err, result) => {
            if (err) return res.send(400, err)
            return res.send(201, { result })
        })
    })

    
}