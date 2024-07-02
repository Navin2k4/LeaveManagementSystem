import mongoose from 'mongoose';
import Department from './api/models/department.model.js';
import Batch from './api/models/batch.model.js';
import Section from './api/models/section.model.js';
import Staff from './api/models/staff.model.js';
import DeptHead from './api/models/depthead.model.js';

const MONGO = "mongodb+srv://navinkumaran2004:navinoh2004@leavedatacluster.fororiu.mongodb.net/CoreDataBase?retryWrites=true&w=majority&appName=LeaveDataCluster"
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const createDemoData = async () => {
  try {
    // Clear existing data
    await Department.deleteMany({});
    await Batch.deleteMany({});
    await Section.deleteMany({});
    await Staff.deleteMany({});
    await DeptHead.deleteMany({});

    // Create Department
    const department = new Department({
      dept_name: 'Computer Science and Engineering',
      dept_acronym: 'CSE',
    });
    await department.save();

    // Create Department Head
    const deptHead = new DeptHead({
      staff_id: 'cse2168',
      staff_name: 'Vinoth',
      staff_mail: 'vk@gmail.com',
      staff_phone: '999964546',
      staff_handle_dept: 'CSE',
    });
    await deptHead.save();

    // Create Batch
    const batch = new Batch({
      batch_name: '2022-2026',
      dept_head: deptHead._id,
    });
    await batch.save();

    // Add batch to department
    department.batches.push(batch._id);
    await department.save();

    const sections = ['A', 'B', 'C'];
    const mentorNames = [
      'Dinesh Kumar',
      'Navin',
      'Suresh',
      'Ramesh',
      'Rajesh',
      'Mahesh',
      'Anil',
      'Sunil',
      'Kumar',
    ];

    // Create Sections and add ClassIncharge and Mentors
    for (let i = 0; i < sections.length; i++) {
      const sectionName = sections[i];

      // Create ClassIncharge
      const classIncharge = new Staff({
        staff_id: `cse_classIncharge_${sectionName}`,
        staff_name: `ClassIncharge_${sectionName}`,
        staff_mail: `classIncharge_${sectionName}@gmail.com`,
        staff_phone: `94181858${i}0`,
        staff_handle_dept: 'CSE',
        staff_handle_batch: '2022-2026',
        staff_handle_section: sectionName,
        staff_role: 'ClassIncharge',
      });
      await classIncharge.save();

      // Create Mentors
      const mentors = [];
      for (let j = 0; j < 3; j++) {
        const mentorIndex = i * 3 + j;
        const mentor = new Staff({
          staff_id: `cse_mentor_${sectionName}_${j}`,
          staff_name: mentorNames[mentorIndex],
          staff_mail: `${mentorNames[mentorIndex].toLowerCase()}@gmail.com`,
          staff_phone: `94181858${i}${j}`,
          staff_handle_dept: 'CSE',
          staff_handle_batch: '2022-2026',
          staff_handle_section: sectionName,
          staff_role: 'Mentor',
        });
        await mentor.save();
        mentors.push(mentor._id);
      }

      // Create Section
      const section = new Section({
        section_name: sectionName,
        classIncharge: classIncharge._id,
        mentors: mentors,
      });
      await section.save();

      // Add section to batch
      batch.sections.push(section._id);
    }
    await batch.save();

    console.log('Demo data inserted successfully');
  } catch (err) {
    console.error(err.message);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(createDemoData);
