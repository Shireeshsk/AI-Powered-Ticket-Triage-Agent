import { Ticket } from "../models/Ticket.js";
export const createTicket = async (req,res)=>{
    const {issue,priority,assignedTo,assigneeReason,replyDraft} = req.body;
    if(!issue || !priority || !assignedTo || !assigneeReason || !replyDraft){
        return res.status(401).json({
            success : false,
            message : "Ticket data not found"
        })
    }
    try{
        const newTicket = new Ticket({
            issue,
            priority,
            assignedTo,
            assigneeReason,
            replyDraft
        })
        await newTicket.save()
        return res.status(200).json({
            success : true,
            message : "Ticket Creation Successful",
            ticket : newTicket
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error"
        })
    }
}