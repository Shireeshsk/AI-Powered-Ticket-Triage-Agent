import express from 'express'
import {config} from 'dotenv'
import cors from 'cors'
import {DBconnect} from './config/Dbconnect.js'
import {router as TicketRouter} from './routes/TicketRoutes.js'
import {router as AssistantRouter} from './routes/AssistantRoutes.js'
// import { seedAssistants } from './config/dataSeed.js'
config()

const app = express()
const port = process.env.PORT 

app.use(cors())
app.use(express.json())
app.use(express.urlencoded())

app.use('/api/ticket',TicketRouter)
app.use('/api/assistant',AssistantRouter)

DBconnect();
// await seedAssistants();
app.listen(port,()=>{
    console.log(`server runnning on http://localhost:${port}`)
})