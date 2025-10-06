import express from "express"
import "dotenv/config"
import cors from "cors"
import ConnectDB from "./configs/db.js"

ConnectDB() 

const app = express()
app.use(cors()) //enable Cross-Origin Resource Sharing
app.get('/', (req,res)=>res.send("API is working fine"))

const port = process.env.PORT || 3000;

app.listen(port, ()=> console.log(`Server running on port ${port}`) )