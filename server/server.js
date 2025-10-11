import express from "express"
import "dotenv/config"
import cors from "cors"
import ConnectDB from "./configs/db.js"
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/ClerkWebhooks.js"
import userRouter from "./routes/userRoutes.js"

ConnectDB() 

const app = express()
app.use(cors()) //enable Cross-Origin Resource Sharing

//Middlewares
app.use(express.json())
app.use(clerkMiddleware())

// API to listen to clerk Webhooks
app.use("/api/clerk", clerkWebhooks);


app.get('/', (req,res)=>res.send("API is working fine"))
app.use('/api/user' , userRouter)


const port = process.env.PORT || 3000;

app.listen(port, ()=> console.log(`Server running on port ${port}`) )