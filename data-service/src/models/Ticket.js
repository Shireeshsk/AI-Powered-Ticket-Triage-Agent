import mongoose from 'mongoose'
const ticketSchema = new mongoose.Schema({
    issue : {
        type : String
    },
    priority : {
        type: String,
        enum: ['P0', 'P1', 'P2', 'P3'], 
        default: 'P3',
    },
    assignedTo : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assistant',
    },
    assigneeReason : {
        type : String
    },
    replyDraft : {
        type : String
    },
    status : {
        type : String,
        enum : ['open','closed','team is working on it'],
        default : "open"
    }
},{timestamps:true})

export const Ticket = mongoose.model("Ticket",ticketSchema)