// Import necessary modules
import mongoose from 'mongoose';
// Connect to MongoDB
mongoose.connect(
  
  
  "mongodb+srv://navinkumaran2004:navinoh2004@leavedatacluster.fororiu.mongodb.net/CoreDataBase?retryWrites=true&appName=LeaveDataCluster"
  , {
  
  
    useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define mongoose schemas and models
import Batch from "./api/models/batch.model.js";
import Department from "./api/models/department.model.js";
import Section from "./api/models/section.model.js";
import Staff from "./api/models/staff.model.js";

// Function to insert test data
async function insertTestData() {

  Batch.deleteMany();
  Department.deleteMany();
  Section.deleteMany();
  Staff.deleteMany();

  try {
    // Create Department
    const department = await Department.create({
      dept_name: 'Computer Science and Engineering',
      dept_acronym: 'CSE',
      dept_head: null, // To be assigned later
      batches: [], // To be populated with Batch IDs
    });

    // Create Batches
    const batchesData = [
      { batch_name: '2021 - 2020' },
      { batch_name: '2022 - 2026' },
      { batch_name: '2023 - 2027' },
      { batch_name: '2024 - 2028' },
    ];
    const batches = await Batch.insertMany(batchesData);

    // Populate Department with Batch IDs
    department.batches = batches.map(batch => batch._id);
    await department.save();

    // Create Sections for each Batch
    const sectionsData = [];
    const sectionsPerBatch = ['A', 'B', 'C'];

    batches.forEach(batch => {
      sectionsPerBatch.forEach(sectionName => {
        sectionsData.push({
          section_name: sectionName,
          classIncharge: null, // To be assigned later
          mentors: [], // To be populated with Mentor IDs
        });
      });
    });

    const sections = await Section.insertMany(sectionsData);

    // Populate Batches with Section IDs
    batches.forEach(batch => {
      const batchSections = sections.filter(section => section.section_name.includes(batch.batch_name.split(' ')[0]));
      batch.sections = batchSections.map(section => section._id);
      batch.save();
    });

    // Create Staff for Class Incharges and Mentors
    const staffData = [];
    const staffRoles = ['ClassIncharge', 'Mentor'];

    sections.forEach(section => {
      staffRoles.forEach(role => {
        staffData.push({
          staff_id: `${section.section_name}_${role}`,
          staff_name: `${section.section_name} ${role}`,
          staff_mail: `${section.section_name}_${role.toLowerCase()}@cse.com`,
          staff_handle_dept: department._id,
          staff_handle_batch: null, // To be assigned later
          staff_handle_section: section._id,
          staff_role: role,
          isMentor: role === 'Mentor',
          isClassIncharge: role === 'ClassIncharge',
          password: 'password', // Example password, please use secure methods in production
          userType: 'Staff',
        });
      });
    });

    const staff = await Staff.insertMany(staffData);

    // Assign Class Incharges and Mentors to Sections
    sections.forEach(section => {
      const sectionStaff = staff.filter(staffMember => staffMember.staff_handle_section.equals(section._id));
      const classIncharge = sectionStaff.find(member => member.staff_role === 'ClassIncharge');
      section.classIncharge = classIncharge._id;
      
      const mentors = sectionStaff.filter(member => member.staff_role === 'Mentor');
      section.mentors = mentors.map(mentor => mentor._id);

      section.save();
    });

    console.log('Test data inserted successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error inserting test data:', error);
  }
}

// Call function to insert test data
insertTestData();
