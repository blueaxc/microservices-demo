const amqp = require('amqplib')

async function startConsume() {
    try {
        const rabbitmq = process.env.RABBITMQ_URL || 'amqp://gues:gues@rabbitmq:5672'
        const connection  = await amqp.connect(rabbitmq)
        const channel = await connection.createChennel()

        const queue = 'orderQueue'

        await channel.assertQueue(queue, { durable: true})

        console.log(`waitng for message in ${queue}`)

        channel.consume(queue, (msg) => {
            if(msg!==null) {
                const content = msg.connect.toString
                console.log(`Receve message: ${content}`)
                channel.ack(msg)
            }
        })
    }catch (error) {
        console.log('RabbtMQ consumer Error:', error)
    }
}

startConsume()