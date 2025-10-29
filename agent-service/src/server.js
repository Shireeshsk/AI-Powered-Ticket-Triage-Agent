import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import { callAgent } from './Agent.js'
config()

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(express.urlencoded())
app.use(cors());

app.post('/call-agent',async (req,res)=>{
    const {userInput} = req.body
    if(!userInput){
        return res.status(400).json({
            success : false,
            message : "User input required"
        })
    }
    try{
        const response = await callAgent(userInput)
        return res.status(200).json({
            success : false,
            message : "Agent sent a response",
            response : response
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success : false,
            message : "Internal Server Error"
        })
    }
})

app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`)
})