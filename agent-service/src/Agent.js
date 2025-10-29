import Groq from 'groq-sdk'
import {config} from 'dotenv'
import { getAssistants } from './tools/getAssistants.js';
import { saveTicket } from './tools/saveTicket.js';
import { assignTicket } from './tools/assignTicket.js';
config();

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY, 
});

const tools = [
  {
    type: "function",
    function: {
      name: "getAssistants",
      description:
        "Fetches the list of all available human assistants from the database. Returns an array of assistants with their _id, name, email, and department.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
];

export async function callAgent(userInput){
    const messages = [
        {
            role: "system",
            content: `
            You are TriageBot, an intelligent helpdesk triage assistant.
            
            Your task is to analyze user-reported support issues, select the best-fit human assistant by using tools, and output a structured JSON object that matches the MongoDB ticket schema below.

            You have access to a tool called **getAssistants**, which returns a list of all available human assistants with their _id, name, email, and department.  
            You must **call this tool first** to retrieve all assistants, then **analyze the user's issue context** and **choose the most suitable assistant** logically from the returned list — do not guess or create your own assistant data.
            Just give me the json object as the response and nothing else
            ### TICKET SCHEMA:
            {
            "issue": "string",
            "priority": "P0 | P1 | P2 | P3",
            "assignedTo": {
                "_id": "assistant_id",
                "name": "assistant_name",
                "department": "assistant_department"
            },
            "assigneeReason": "string",
            "replyDraft": "string",
            "status": "open | closed | team is working on it"
            }

            ### DEPARTMENT DESCRIPTIONS

                - Billing – Handles issues related to invoices, overcharges, billing discrepancies, and payment summaries. Ensures accurate account billing and financial records.

                - Payments – Manages transaction failures, refund requests, payment gateway errors, and unprocessed payments.

                - Technical Support – Resolves software bugs, app crashes, system errors, and login or connectivity problems.

                - Account Management – Helps users with profile settings, password resets, account recovery, and user access permissions.

                - Subscription Services – Manages plan renewals, cancellations, upgrades, downgrades, and subscription expirations.

                - Product Support – Provides assistance with product usage, configuration, compatibility, and setup guidance.

                - Shipping & Delivery – Handles order tracking, shipment delays, lost packages, and delivery confirmation issues.

                - Returns & Refunds – Processes product returns, exchanges, refund status inquiries, and quality-related complaints.

                - Customer Success – Focuses on customer onboarding, satisfaction improvement, and proactive support to ensure a positive experience.

                - Sales & Offers – Deals with promotional offers, discounts, sales queries, and product pricing information.

                - Feedback & Complaints – Collects and responds to customer feedback, reviews, and formal service-related complaints.

                - General Inquiries – Addresses how-to questions, feature usage guidance, or non-urgent, general customer queries.

            ### RULES:
            1. Assign a priority (P0–P3) based on urgency and impact.
                - P0 = system down / severe outage
                - P1 = critical issue but system works partially
                - P2 = minor issue / performance bug
                - P3 = general inquiry or low urgency
            2. Choose the most suitable **assistant** based on the issue, matching their department or skill.
            3. Explain briefly why that assistant was chosen in **assigneeReason**.
            4. Write a concise, polite **replyDraft** (≤120 words) acknowledging the issue and providing initial guidance.
            5. Default **status** should be "open".
            6. Always call **getAssistants** before assigning — never assume or fabricate assistant data.
            7. Respond **only in valid JSON** — no extra text, markdown, or explanations outside the JSON.

            ### EXAMPLE OUTPUT:
            {
            "issue": "Payment completed but not reflected on dashboard",
            "priority": "P1",
            "assignedTo": {
                "_id": "671fa4a89dc9ab16a13e3b88",
                "name": "Clara",
                "department": "Payments"
            },
            "assigneeReason": "Assigned to Clara from the Payments department since this is a billing issue.",
            "replyDraft": "Hi there! Thanks for reporting the issue. Our payments specialist Clara is checking your transaction and will update your dashboard shortly.",
            "status": "open"
            }

            Current datetime: ${new Date().toUTCString()}
            `
        },
        {
            role : 'user',
            content : userInput
        }
    ]
    let finalans;
    while (true) {
        const completion = await client.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages,
            tools,
            tool_choice: "auto",
            // response_format: { type: "json_object" },
        });

        const msg = completion.choices[0].message;
        const toolCall = msg.tool_calls?.[0];

        if (toolCall) {
        const { name } = toolCall.function;
        console.log(`🧩 Tool call requested: ${name}`);

        let result;
        if (name === "getAssistants") {
            result = await getAssistants();
        }

        // Add model's tool call and result back into conversation
        messages.push(msg);
        messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            name,
            content: JSON.stringify(result),
        });
        } else {
            try {
                const parsed = JSON.parse(msg.content);
                finalans = parsed
                console.log("\n✅ Final Response:\n", parsed);
            } catch (err) {
                finalans = msg.content
                console.error("\n❌ Invalid JSON response received:\n", msg.content);
            }
            break;
        }
    }
    if(finalans && finalans.issue && finalans.priority && finalans.assignedTo._id && finalans.assigneeReason && finalans.replyDraft) {
        const payload = {
            issue : finalans.issue,
            priority : finalans.priority,
            assignedTo : finalans.assignedTo._id,
            assigneeReason : finalans.assigneeReason,
            replyDraft : finalans.replyDraft
        }
        const ticket = await saveTicket(payload)
        if(ticket){
            const payload2 = {
                ticketId : ticket._id,
                assistantId : finalans.assignedTo._id
            }
            const sk = await assignTicket(payload2)
        }
    }
    return finalans
}
