const amqp = require('amqplib')

async function consumeMessage(queue, callback) {
    try {
         const connection = await amqp.connect('amqp://guest:guest@rabbitmq:5672')
         const channel = await connection.createChannel();

         await channel.assertQueue(queue, { durable:false})
         console.log(` [*] wait for message in queue: ${queue}`)
         
         channel.consume(queue, (msg) => {
            if (msg!==null) {
                const content = msg.connect.string()
                console.log(` [x] Received: ${content}`)
                callback(content)
                channel.ack(msg)
            }
         })
    } catch (error) {
        console.error('Error consuming message', error)
    }
}

module.exports = consumeMessage