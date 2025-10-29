import mongoose from 'mongoose';

const assistantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  department: {
    type: String,
    enum: [
        "Billing",
        "Payments",
        "Technical Support",
        "Account Management",
        "Subscription Services",
        "Product Support",
        "Shipping & Delivery",
        "Returns & Refunds",
        "Customer Success",
        "Sales & Offers",
        "Feedback & Complaints",
        "General Inquiries",
      ],
    default: "General Inquiries",
    required: true,
  },
  assignedTickets :[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
    },
  ],
}, { timestamps: true });

export const Assistant = mongoose.model('Assistant', assistantSchema);