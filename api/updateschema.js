import mongoose from "mongoose";
import Defaulter from "./models/defaulter.model.js"; // Adjust the path to your schema file

const addDefaulterEntry = async () => {
  try {
    // MongoDB connection string (change it as needed)
    const mongoUri = "mongodb+srv://navinkumaran2004:navinoh2004@leavedatacluster.fororiu.mongodb.net/CoreDataBase?retryWrites=true&w=majority&appName=LeaveDataCluster";  // Use your actual MongoDB URI here
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

    const newDefaulter = new Defaulter({
      roll_no: "22CSEB59",
      entryDate: new Date(),
      timeIn: "08:15 AM",
      observation: "Not following the dress code",
      mentorId: "675bba5d0446ab866eb26986", 
      defaulterType:"Late"// Replace with a valid Staff ObjectId
    });

    const savedDefaulter = await newDefaulter.save();
    console.log("Defaulter entry saved:", savedDefaulter);
  } catch (error) {
    console.error("Error saving defaulter entry:", error);
  } finally {
    mongoose.disconnect(); // Close the connection when done
  }
};

addDefaulterEntry();
