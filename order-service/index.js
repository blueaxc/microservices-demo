const express = require('express')
const axios = require('axios')
const amqp = require('amqplib')

const app = express()
const PORT = 3002

app.use(express.json())

let orders = []

// RabbitMQ connection & consumer
// async function startRabbitMQConsumer() {
//     try {
//         const connection = await amqp.connect('amqp://guest:guest@rabbitmq:5672');
//         const channel = await connection.createChannel();

//         const queue = 'userQueue';
//         await channel.assertQueue(queue, { durable: false });

//         console.log(` [*] Waiting for messages in ${queue}. To exit press CTRL+C`);
//         channel.consume(queue, (msg) => {
//             if (msg !== null) {
//                 console.log(` [x] Received from RabbitMQ: ${msg.content.toString()}`);
//                 channel.ack(msg);
//             }
//         });
//     } catch (error) {
//         console.error("RabbitMQ consumer error:", error);
//     }
// }

//const amqp = require("amqplib");

async function startRabbitMQConsumer() {
  const RABBIT_URL = process.env.RABBITMQ_URL || "amqp://guest:guest@rabbitmq:5672";

  while (true) {
    try {
      const connection = await amqp.connect(RABBIT_URL);
      const channel = await connection.createChannel();

      const queue = "userQueue";
      await channel.assertQueue(queue, { durable: false });

      console.log(` [*] Waiting for messages in ${queue}. To exit press CTRL+C`);
      channel.consume(queue, (msg) => {
        if (msg !== null) {
          console.log(` [x] Received from RabbitMQ: ${msg.content.toString()}`);
          channel.ack(msg);
        }
      });

      break; // ✅ Exit retry loop once connected
    } catch (error) {
      console.error("RabbitMQ consumer error, retrying in 5s:", error.message);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

//create order
app.post('/orders', async (req, res) => {
    const { userId, item } = req.body

    try {
        const userResponse = await axios.get(`http://user-service:3001/users`)
        const user = userResponse.data.find(u => u.id === userId)
    
    if (!user){
        return res.status(400).json({ message: 'User not found'})
    }

    orders.push({ userId, item })
    res.status(201).json({ message: 'Order created'})
    }catch (err){
        res.status(500).json({ message: 'Error connectiong to user Service'})
    }
})

// List orders
app.get('/orders', (req, res) => {
  res.json(orders);
});

app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`)
    startRabbitMQConsumer()
})