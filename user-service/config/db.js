const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Connect to MongoDB (user-service)")
    }catch (err) {
        console.log("MongoDB connect error (user-service)", err)
    }
}

module.exports = connectDB