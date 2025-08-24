const express = require('express');
const amqp = require('amqplib');
const app = express();
const PORT = 3001;

require('./config/db');

app.use(express.json());

let users = [];
let channel;

// Create user
app.post('/users', (req, res) => {
    const { id, name } = req.body;
    const newUser = { id, name };
    users.push(newUser);

    // Publish message to RabbitMQ
    try {
        if (channel) {
            channel.sendToQueue("userQueue", Buffer.from(JSON.stringify(newUser)));
            console.log(" [x] Sent to RabbitMQ:", newUser);
        } else {
            console.error("RabbitMQ channel not available");
        }
    } catch (error) {
        console.error("Failed to send message to RabbitMQ:", error);
    }

    res.status(201).json({ message: 'User created' });
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
app.get('/users', (req, res) => {
    res.json(users);
});

app.listen(PORT, async () => {
    console.log(`User service running on ${PORT}`);
    await connectRabbitMQ();
});