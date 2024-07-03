import { MongoClient } from 'mongodb';

// Connection URIs for the source and destination MongoDB databases
// const sourceUri = 'mongodb+srv://navinkumaran2004:navinoh2004@cgpa-calculator.atgd2vw.mongodb.net/CGPA-Calculator?retryWrites=true&w=majority&appName=CGPA-Calculator';  // Replace with your source database URI
// const destUri = 'mongodb+srv://navinkumaran2004:navinoh2004@leavedatacluster.fororiu.mongodb.net/CoreDataBase?retryWrites=true&w=majority&appName=LeaveDataCluster';
// Names of the collections to clone
const collectionName = 'students';

async function cloneCollection() {
  const client = new MongoClient(sourceUri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Connect to the source MongoDB
    await client.connect();

    // Access the source collection
    const sourceDB = client.db();
    const sourceCollection = sourceDB.collection(collectionName);

    // Fetch all documents from the source collection
    const documents = await sourceCollection.find({}).toArray();

    // Connect to the destination MongoDB
    const destClient = new MongoClient(destUri, { useNewUrlParser: true, useUnifiedTopology: true });
    await destClient.connect();
    
    // Access the destination collection
    const destDB = destClient.db();
    const destCollection = destDB.collection(collectionName);

    // Insert documents into the destination collection
    await destCollection.insertMany(documents);

    console.log(`Collection ${collectionName} cloned successfully.`);

  } catch (error) {
    console.error('Error cloning collection:', error);
  } finally {
    // Close the connections
    await client.close();
    await destClient.close();
  }
}

// Call the function to clone the collection
cloneCollection();
