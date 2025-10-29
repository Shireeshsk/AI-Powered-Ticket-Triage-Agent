import express from 'express'
import { getAssistants } from '../controllers/getAssistants.js'
import { addTicket } from '../controllers/addTicket.js'
export const router = express.Router()

router.get('/get',getAssistants)
router.post('/add-ticket',addTicket)
