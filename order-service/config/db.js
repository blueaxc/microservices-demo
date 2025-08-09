const mongoose = require('mongoose')

const mongoURL = process.env.mongoURL || 'ongodb://mongo:27017/userdb'

mongoose.connect(mongoURL, {
    userNewUrlParser: true,
    userUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Connected')
}).then((err) => {
    console.log('Mongo DB connection error', err)
})