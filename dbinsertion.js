// Import necessary modules
import mongoose from 'mongoose';

// Connect to MongoDB
mongoose.connect("mongodb+srv://navinkumaran2004:navinoh2004@leavedatacluster.fororiu.mongodb.net/CoreDataBase?retryWrites=true&appName=LeaveDataCluster", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define mongoose models
import Batch from "./api/models/batch.model.js";
import Section from "./api/models/section.model.js";

// Function to insert sections and assign them to existing batches
async function insertSectionsToBatches() {
  try {
    // Get existing batches
    const batches = await Batch.find();

    // Create Sections for each Batch
    const sectionsData = [];
    const sectionsPerBatch = ['A', 'B', 'C'];

    batches.forEach(batch => {
      sectionsPerBatch.forEach(sectionName => {
        sectionsData.push({
          section_name: `${batch.batch_name} - ${sectionName}`,
          batch: batch._id,
        });
      });
    });

    // Insert Sections into MongoDB
    const sections = await Section.insertMany(sectionsData);

    // Update each batch with Section IDs
    await Promise.all(batches.map(async (batch) => {
      const batchSections = sections.filter(section => section.batch.equals(batch._id));
      batch.sections = batchSections.map(section => section._id);
      await batch.save();
    }));

    console.log('Sections assigned to batches successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error assigning sections to batches:', error);
  }
}

// Call function to insert sections and assign them to batches
insertSectionsToBatches();
