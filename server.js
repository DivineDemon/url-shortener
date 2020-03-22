const express = require('express')
const mongoose = require('mongoose')

const shortURL = require('./models/short-urls')

const app = express();

mongoose.connect('mongodb://urlshortuser:93561026m@testlocal-shard-00-00-o2edm.mongodb.net:27017,testlocal-shard-00-01-o2edm.mongodb.net:27017,testlocal-shard-00-02-o2edm.mongodb.net:27017/url-shortener?ssl=true&replicaSet=testLocal-shard-0&authSource=admin&retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
    const shorturls = await shortURL.find()
    res.render('index', { shorturls: shorturls })
})

app.post('/shortUrls', async (req, res) => {
    await shortURL.create({ full: req.body.fullUrl })
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await shortURL.findOne({ short: req.params.shortUrl })
    if(shortUrl === null) {
        return res.sendStatus(404)
    }
    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000)