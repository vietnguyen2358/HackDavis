import { connectToDatabase } from "./db.js";
import { initialData } from "./initialData.js";

async function importSystemPrompt() {
  try {
    const systemPrompt = initialData.systemPrompt;

    const db = await connectToDatabase();
    const collection = db.collection("systemPrompt");

    // Upsert the system prompt
    await collection.updateOne(
      { _id: "systemPrompt" },
      { $set: systemPrompt },
      { upsert: true }
    );

    console.log("System prompt imported successfully");
  } catch (error) {
    console.error("Error importing system prompt:", error);
    process.exit(1);
  }
}

importSystemPrompt(); 