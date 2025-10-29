import mongoose from "mongoose";
import { Assistant } from "../models/Assistant.js";
import { config } from "dotenv";
config();

// MongoDB connection
const MONGO_URL = process.env.MONGO_URL;

// 🎯 Customer-facing departments
const departments = [
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
];

// 🇮🇳 Indian names (one per department)
const indianAssistants = [
  { name: "Aarav Sharma" },
  { name: "Priya Reddy" },
  { name: "Rohan Mehta" },
  { name: "Diya Patel" },
  { name: "Kartik Verma" },
  { name: "Ananya Gupta" },
  { name: "Ishaan Nair" },
  { name: "Meera Iyer" },
  { name: "Vihaan Joshi" },
  { name: "Kiara Menon" },
  { name: "Aditya Rao" },
  { name: "Saanvi Singh" },
];

// ✅ Generate assistant data
const generateAssistants = () =>
  departments.map((dept, i) => {
    const name = indianAssistants[i].name;
    const email = name.toLowerCase().replace(/\s+/g, ".") + "@support.in";
    return {
      name,
      email,
      department: dept,
    };
  });

// ✅ Reusable seeding function (no auto-run)
export async function seedAssistants() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    await Assistant.deleteMany({});
    console.log("🧹 Cleared existing assistants");

    const assistants = generateAssistants();
    await Assistant.insertMany(assistants);

    console.log("🌱 Seeded 12 customer-facing assistants successfully!\n");
    console.table(
      assistants.map((a) => ({
        name: a.name,
        email: a.email,
        department: a.department,
      }))
    );

    await mongoose.connection.close();
    console.log("\n🔒 Connection closed");

    return assistants;
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}
