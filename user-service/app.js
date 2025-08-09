const express = require('express')
const app = express()
const PORT = 3001

require('./config/db')

app.use(express.json())

let users = []

//create user
app.post('/users', (req, res) => {
    const {id, name} = req.body
    users.push({ id, name })
    res.status(201).json({ message: 'User created' })
})

// List user
app.get('/users', (req, res) => {
    res.json(users)
})

app.listen(PORT, () => {
    console.log(`User service running on ${PORT}`)
})