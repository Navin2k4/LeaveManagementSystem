import xlsx from "xlsx";
import fs from "fs";
import Student from "../models/student.model.js";
import Staff from "../models/staff.model.js";
import Department from "../models/department.model.js";
import Batch from "../models/batch.model.js";
import Section from "../models/section.model.js";

// Upload and process student data
export const uploadStudentData = async (req, res) => {
  const filePath = req.file.path;

  try {
    await processStudentExcelFile(filePath);
    fs.unlinkSync(filePath);
    res.status(200).json({ message: "Student details processed successfully." });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Utility function to find or throw an error if a model is not found
async function findModelOrThrow(Model, query, entityName) {
  const record = await Model.findOne(query);
  if (!record) {
    throw new Error(`${entityName} not found for query: ${JSON.stringify(query)}`);
  }
  return record;
}

// Function to process the student data from the Excel file
export async function processStudentExcelFile(filePath) {
  try {
    // Read the Excel file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Iterate over the rows
    for (const row of sheetData) {
      const {
        roll_no,
        name,
        dept_acronym,
        year,
        sec,
        mentor,
        classincharge,
        register_no,
        email,
        phone,
      } = row;

      // Step 1: Find the department based on dept_acronym
      const department = await findModelOrThrow(Department, { dept_acronym }, "Department");

      // Step 2: Find the batch based on the department and batch name (year)
      const batch = await Batch.findOne({ 
        department: department._id, 
        batch_name: year 
      });

      if (!batch) {
        throw new Error(`Batch ${year} not found in department ${dept_acronym}.`);
      }

      // Step 3: Find the section based on the batch ID and section name
      const section = await Section.findOne({
        Batch: batch._id,
        section_name: sec,
      });

      if (!section) {
        throw new Error(`Section ${sec} not found for batch ${year} in department ${dept_acronym}.`);
      }

      // Validate mentor and class-in-charge
      const mentorStaff = await Staff.findOne({ staff_name: mentor, isMentor: true });
      if (!mentorStaff) {
        throw new Error(`Mentor ${mentor} not found in Staff collection.`);
      } 

      const classInchargeStaff = await Staff.findOne({ staff_name: classincharge, isClassIncharge: true });
      if (!classInchargeStaff) {
        throw new Error(`Class In-Charge ${classincharge} not found in Staff collection.`);
      }

      // Check if the student already exists
      const existingStudent = await Student.findOne({ roll_no });
      if (existingStudent) {
        console.log(`Student with roll_no ${roll_no} already exists, skipping.`);
        continue;
      }

      // Create a new student record with the register_no as password
      await Student.create({
        roll_no,
        register_no,
        password: register_no, // Use register number as password
        name,
        email,
        phone,
        departmentId: department._id,
        sectionId: section._id,
        section_name: sec,
        batchId: batch._id,
        userType: "Student",
        status: "active",
      });

      console.log(`Student ${roll_no} added successfully.`);
    }
  } catch (error) {
    console.error("Error processing Excel file:", error.message);
    throw error;
  }
}
