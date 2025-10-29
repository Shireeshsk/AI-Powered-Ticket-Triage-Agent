import express from 'express'
import { createTicket } from '../controllers/createTicket.js'
import { getTicket } from '../controllers/getTickets.js'
export const router = express.Router()

router.post('/create',createTicket)
router.get('/get',getTicket)