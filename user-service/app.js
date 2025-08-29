const express = require('express')
const amqp = require('amqplib')
const connectDB = require('./config/db')
const User = require('./models/User')

const app = express();
const PORT = 3001;

app.use(express.json());

let channel;

// Create user
app.post('/users', async (req, res) => {
    try{
        const { id, name } = req.body

        //validasi input sederhana
        if(!id || !name){
            return res.status(400).json({ error: "id and name required"})
        }

        //simpan ke MongoDB
        const newUser = new User({id, name})
        const savedUser = await newUser.save()

        //publish ke RabbitMQ
        if(channel){
            channel.sendToQueue(
                "userQueue",
                Buffer.from(JSON.stringify(savedUser))
            )
           console.log(" [x-x] sent to RabbitMQ:", (savedUser)) 
        }else{
            console.log("RabbitMQ not available")
        }

        //Response sukses (201 Created)
        return res.status(201).json({
            message: "User created successfully",
            user: savedUser
        })

    }catch(err){
        console.log("X error creating User: ", err)

        // Tanggapi duplikasi key error MongoDB
        if (err.code === 11000){
            return res.status(400).json({ error: "user with this id already exist"})
        }
    }
});

// List users
app.get('/users', async (req, res) => {
    const user = await User.find()
    res.json(user);
});

// RabbitMQ setup
async function connectRabbitMQ() {
    const amqpUrl = process.env.RABBITMQ_URL || "amqp://guest:guest@rabbitmq:5672";

    while (!channel) {
        try {
            const connection = await amqp.connect(amqpUrl);
            channel = await connection.createChannel();
            await channel.assertQueue("userQueue", { durable: false });
            console.log("✅ user-service connected to RabbitMQ");
        } catch (error) {
            console.error("❌ Failed to connect to RabbitMQ, retrying in 5s...");
            await new Promise(res => setTimeout(res, 5000));
        }
    }
}

// List users
// app.get('/users', (req, res) => {
//     res.json(users);
// });

app.listen(PORT, async () => {
    console.log(`User service running on ${PORT}`)
    await connectDB()
    await connectRabbitMQ()
});