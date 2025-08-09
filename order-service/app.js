const express = require('express')
const axios = require('axios')

const app = express()
const PORT = 3002

app.use(express.json())

let orders = []

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
})