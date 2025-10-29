import {Ticket} from '../models/Ticket.js'
import {Assistant} from '../models/Assistant.js'

export const addTicket = async (req,res)=>{
    const {ticketId , assistantId} = req.body;
    if(!ticketId && !assistantId){
        return res.status(401).json({
            success : false,
            message : 'Missing required feilds'
        })
    }
    try{
        const ticket = await Ticket.findById(ticketId)
        if(!ticket){
            return res.status(401).json({
                success : false,
                message : 'Ticket Not Found'
            })
        }
        const assistant = await Assistant.findById(assistantId)
        if(!assistant){
            return res.status(401).json({
                success : false,
                message : 'Assistant Not Found'
            })
        }
        if (assistant.assignedTickets.includes(ticket._id)) {
            return res.status(400).json({
                success: false,
                message: "Ticket already assigned to this assistant",
            });
        }
        assistant.assignedTickets.push(ticket._id)
        await assistant.save()
        return res.status(200).json({
            success : true,
            message : "Ticket assignment successful"
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success : false,
            message : "Internal Server Error"
        })
    }
}