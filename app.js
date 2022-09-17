const express = require('express')
const app = express()
const students = require('./routes/students')
const subjects = require('./routes/subjects')
const categories = require('./routes/categories')
const connectDB = require('./db/connect')
const Category = require('./models/Category')
require('dotenv').config()


//middleware
app.use(express.static('./public'))
app.use(express.json())

//routes
app.use('/api/v1/students', students)
app.use('/api/v1/subjects', subjects)
app.use('/api/v1/categories', categories)


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