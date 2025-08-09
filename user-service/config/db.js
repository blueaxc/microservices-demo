const mongoose = require('mongoose')

const mongoURL = process.env.MONGO_URL || 'mongodb://mongo:27017/userdb';

mongoose.connect(mongoURL) 
.then(() => {
    console.log('MongoDB Connected')
}).catch((err) => {
    console.error('Mongo DB error', err)
})