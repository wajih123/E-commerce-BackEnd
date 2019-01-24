const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

mongoose.connect('mongodb+srv://wajih:H1JHToZQuZMveG6O@cluster0-akpak.mongodb.net/fichas')

app.use(bodyParser.json())
app.use(morgan('combined'))
app.use (function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.header('Access-Control-Allow-Headers', 'x-apicache-bypass, X-Requested-With, Content-Type, Cache-Control, token, Request-Type, Content-Disposition, Request-Source');
    next();
});
app.options('*', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS, PUT, PATCH")
    res.send(200)
}
)
require('./models')()
require('./routes')(app)


app.listen(3000, () => console.log('Server Listening'))