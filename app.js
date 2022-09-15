const express = require('express')
const app = express()
const students = require('./routes/students')
const subjects = require('./routes/subjects')
const connectDB = require('./db/connect')
require('dotenv').config()


//middleware
app.use(express.json())

//routes
app.get('/hello', (req, res) => {
    res.send('Task Manager App')
})

app.use('/api/v1/students', students)
app.use('/api/v1/subjects', subjects)

const port = 3000

const start = async () => {
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening on port ${port}...`))
    }catch(error){
        console.log(error)
    }
}

start()