// Script to remove duplicate appointments (same patientName, date, time) from the appointments collection
// Keeps only one document per unique combination

import { connectToDatabase } from '../mongodb/mongodb.js';

async function deduplicateAppointments() {
  const db = await connectToDatabase();
  const collection = db.collection('appointments');

  // Find duplicates by grouping on patientName, date, and time
  const duplicates = await collection.aggregate([
    {
      $group: {
        _id: { patientName: "$patientName", date: "$date", time: "$time" },
        ids: { $push: "$_id" },
        count: { $sum: 1 }
      }
    },
    { $match: { count: { $gt: 1 } } }
  ]).toArray();

  let removed = 0;
  for (const doc of duplicates) {
    // Keep one, remove the rest
    const idsToRemove = doc.ids.slice(1);
    if (idsToRemove.length > 0) {
      const res = await collection.deleteMany({ _id: { $in: idsToRemove } });
      removed += res.deletedCount;
    }
  }

  console.log(`Removed ${removed} duplicate appointments.`);
}

deduplicateAppointments().then(() => {
  console.log('Deduplication complete.');
  process.exit(0);
}).catch(err => {
  console.error('Error during deduplication:', err);
  process.exit(1);
});
