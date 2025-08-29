// const amqp = require('amqplib');

// async function sendMessage(queue, message) {
//     try{
//         const connection = await amqp.connect('amqp://guest:guest@rabbitmq:5672')
//         const channel = await connection.createChannel.createChannel();
//         await channel.assertQueue(queue, { durable: false })
//         channel.sendToQueue(queue, Buffer,from(message))
//         console.log(" [x] send %s", message)
//         await channel.close()
//         await connection.close();
//     } catch (err) {
//         console.log("RabbitMQ error", err)
//     }
// }

// module.exports = sendMessage;

const amqp = require('amqplib');

async function sendMessage(queue, message) {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(queue, { durable: false });
        channel.sendToQueue(queue, Buffer.from(message));
        console.log(" [x] Sent %s", message);
        await channel.close();
        await connection.close();
    } catch (err) {
        console.error("RabbitMQ error", err);
    }
}

module.exports = sendMessage;