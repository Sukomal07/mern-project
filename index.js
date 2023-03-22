import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import path from 'path'
import {fileURLToPath} from 'url'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import flightRoutes from './routes/flightRouter.js'
import chatBotRoutes from './routes/chatBot.js'


const app = express()
dotenv.config()

const __fliname = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__fliname)

const connect = () =>{
    mongoose.set('strictQuery' , false)
    mongoose.connect(process.env.MONGO)
    .then(()=>{
        console.log("databse connection successful");
        console.log(`server running on ${process.env.PORT}`);
    })
    .catch((err) =>{
        console.log(err);
    })
}

app.use(cookieParser())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('./api/user', userRoutes)
app.use('/api', flightRoutes)
app.use('/api/query', chatBotRoutes)
app.use(express.static(path.join(__dirname, './client/build')))

app.use("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"))
})

app.listen(process.env.PORT , ()=>{
    connect()
})