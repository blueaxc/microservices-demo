module.exports = {
    connect: async (url) => {
        console.log(`Mock connect to ${url}`)
        return {
            createChannel: async () => {
                console.log('Mock Create Channel')
                return {
                    assertQueue: async (queue, opts) => {
                        console.log(`Mock assertQueue: ${queue}`, opts)
                    },
                    sendToQueue: async (queue, buffer) => {
                        console.log(`Mock SendToQueue ${queue}`, buffer.toString())
                    },
                    close: async () => {
                        console.log("Mock channel close")
                    }
                }
            },
            close: async() => {
                console.log("Mock connection close")
            }
        }
    }
}