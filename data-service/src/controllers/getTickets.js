import { Ticket } from "../models/Ticket.js";

export const getTicket = async (req,res)=>{
    try{
        const Tickets = await Ticket.find();
        return res.status(200).json({
            success : true,
            message : "Success",
            data : Tickets
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success : false,
            message : 'Internal Server Error'
        })
    }
}