const express = require("express")
const app = express()
const path = require("path")
const {logger, logEvents} = require('./middleware/logger')
const errorHandler = require('./middleware/errorhandler')
const cookieParser = require('cookie-parser')
const cors = require("cors") 
const corsOptions = require("./config/corsOptions")
const PORT = process.env.PORT || 3500 
const dotenv= require ('dotenv')
const colors = require ('colors')

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

const connectDB = require('./config/db')

dotenv.config({path: './config/config.env'})

connectDB()



app.use(express.urlencoded({extended: false }))



app.use('/',express.static(path.join(__dirname, 'public')))


app.use('/', require('./routes/root'))



app.all('*', (req, res) => {
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    }else if (req.accepts('json')){
        res.json({message: '404 Not Found'})
    }else{
        res.type('txt').send('404 Not Found')
    }
})





app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))