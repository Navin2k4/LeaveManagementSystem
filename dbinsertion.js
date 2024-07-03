import mongoose from "mongoose";
import Department from "./api/models/department.model.js";
import Batch from "./api/models/batch.model.js";
import Section from "./api/models/section.model.js";
import Staff from "./api/models/staff.model.js";
import DeptHead from "./api/models/depthead.model.js";

const MONGO_URI =
  "mongodb+srv://navinkumaran2004:navinoh2004@leavedatacluster.fororiu.mongodb.net/CoreDataBase?retryWrites=true&appName=LeaveDataCluster";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected...");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

const insertData = async () => {
  try {
    // Clear existing data
    await Department.deleteMany({});
    await Batch.deleteMany({});
    await Section.deleteMany({});
    await Staff.deleteMany({});
    await DeptHead.deleteMany({});

    // Create Department Head
    const deptHead = new DeptHead({
      staff_id: "dept_head_id_1",
      staff_name: "Department Head Name",
      staff_mail: "dept_head@example.com",
      staff_phone: "1234567890",
      staff_handle_dept: null, // This will be assigned later when department is created
    });
    await deptHead.save();

    // Department 1 - Computer Science and Engineering
    const department1 = new Department({
      dept_name: "Computer Science and Engineering",
      dept_acronym: "CSE",
      dept_head: deptHead._id,
    });
    await department1.save();
    deptHead.staff_handle_dept = department1._id; // Assign department to department head
    await deptHead.save();

    // Create Batch for Department 1
    const batch1 = new Batch({
      batch_name: "2022-2026",
    });
    await batch1.save();

    // Add batch to Department 1
    department1.batches.push(batch1._id);
    await department1.save();

    // Create Sections for Department 1
    const sectionsData1 = [
      {
        section_name: "A",
      },
      {
        section_name: "B",
      },
      {
        section_name: "C",
      },
    ];

    for (let sectionData of sectionsData1) {
      // Create Class Incharge for each section in Department 1
      const classIncharge = new Staff({
        staff_id: `class_incharge_${sectionData.section_name}`,
        staff_name: `Class Incharge ${sectionData.section_name}`,
        staff_mail: `class_incharge_${sectionData.section_name}@example.com`,
        staff_phone: "1234567890",
        staff_handle_dept: department1._id,
        staff_handle_batch: batch1.batch_name,
        staff_handle_section: null, // This will be assigned later when section is created
        staff_role: "ClassIncharge",
      });
      await classIncharge.save();

      // Create Mentors for each section in Department 1 (up to 3 mentors)
      const mentorsData = [
        {
          mentor_id: `mentor_${sectionData.section_name}_1`,
          mentor_name: `Mentor 1 of Section ${sectionData.section_name}`,
        },
        {
          mentor_id: `mentor_${sectionData.section_name}_2`,
          mentor_name: `Mentor 2 of Section ${sectionData.section_name}`,
        },
        {
          mentor_id: `mentor_${sectionData.section_name}_3`,
          mentor_name: `Mentor 3 of Section ${sectionData.section_name}`,
        },
      ];

      const mentors = [];
      for (let mentorData of mentorsData) {
        const mentor = new Staff({
          staff_id: mentorData.mentor_id,
          staff_name: mentorData.mentor_name,
          staff_mail: `${mentorData.mentor_id}@example.com`,
          staff_phone: "1234567890",
          staff_handle_dept: department1._id,
          staff_handle_batch: batch1.batch_name,
          staff_handle_section: null, // This will be assigned later when section is created
          staff_role: "Mentor",
        });
        await mentor.save();
        mentors.push(mentor._id);
      }

      // Create Section for Department 1
      const section = new Section({
        section_name: sectionData.section_name,
        classIncharge: classIncharge._id,
        mentors: mentors,
      });
      await section.save();

      // Assign section ID to class incharge
      classIncharge.staff_handle_section = section._id;
      await classIncharge.save();

      // Assign section ID to mentors
      for (let mentorId of mentors) {
        const mentor = await Staff.findById(mentorId);
        mentor.staff_handle_section = section._id;
        await mentor.save();
      }

      // Assign section to batch
      batch1.sections.push(section._id);
      await batch1.save();
    }

    // Department 2 - Electrical Engineering
    const department2 = new Department({
      dept_name: "Electrical Engineering",
      dept_acronym: "EE",
      dept_head: deptHead._id,
    });
    await department2.save();
    deptHead.staff_handle_dept = department2._id; // Assign department to department head
    await deptHead.save();

    // Create Batch for Department 2
    const batch2 = new Batch({
      batch_name: "2023-2027",
    });
    await batch2.save();

    // Add batch to Department 2
    department2.batches.push(batch2._id);
    await department2.save();

    // Create Sections for Department 2
    const sectionsData2 = [
      {
        section_name: "X",
      },
      {
        section_name: "Y",
      },
      {
        section_name: "Z",
      },
    ];

    for (let sectionData of sectionsData2) {
      // Create Class Incharge for each section in Department 2
      const classIncharge = new Staff({
        staff_id: `class_incharge_${sectionData.section_name}`,
        staff_name: `Class Incharge ${sectionData.section_name}`,
        staff_mail: `class_incharge_${sectionData.section_name}@example.com`,
        staff_phone: "1234567890",
        staff_handle_dept: department2._id,
        staff_handle_batch: batch2.batch_name,
        staff_handle_section: null, // This will be assigned later when section is created
        staff_role: "ClassIncharge",
      });
      await classIncharge.save();

      // Create Mentors for each section in Department 2 (up to 3 mentors)
      const mentorsData = [
        {
          mentor_id: `mentor_${sectionData.section_name}_1`,
          mentor_name: `Mentor 1 of Section ${sectionData.section_name}`,
        },
        {
          mentor_id: `mentor_${sectionData.section_name}_2`,
          mentor_name: `Mentor 2 of Section ${sectionData.section_name}`,
        },
        {
          mentor_id: `mentor_${sectionData.section_name}_3`,
          mentor_name: `Mentor 3 of Section ${sectionData.section_name}`,
        },
      ];

      const mentors = [];
      for (let mentorData of mentorsData) {
        const mentor = new Staff({
          staff_id: mentorData.mentor_id,
          staff_name: mentorData.mentor_name,
          staff_mail: `${mentorData.mentor_id}@example.com`,
          staff_phone: "1234567890",
          staff_handle_dept: department2._id,
          staff_handle_batch: batch2.batch_name,
          staff_handle_section: null, // This will be assigned later when section is created
          staff_role: "Mentor",
        });
        await mentor.save();
        mentors.push(mentor._id);
      }

      // Create Section for Department 2
      const section = new Section({
        section_name: sectionData.section_name,
        classIncharge: classIncharge._id,
        mentors: mentors,
      });
      await section.save();

      // Assign section ID to class incharge
      classIncharge.staff_handle_section = section._id;
      await classIncharge.save();

      // Assign section ID to mentors
      for (let mentorId of mentors) {
        const mentor = await Staff.findById(mentorId);
        mentor.staff_handle_section = section._id;
        await mentor.save();
      }

      // Assign section to batch
      batch2.sections.push(section._id);
      await batch2.save();
    }

    console.log("Data insertion completed successfully");
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(insertData);
