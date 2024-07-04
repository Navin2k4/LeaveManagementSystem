import mongoose from "mongoose";
import Batch from "../models/batch.model";
import Department from "../models/department.model";
import Section from "../models/section.model";

export const extractStudentDetails = (student) => {
    const { name, email, roll_no, register_no, phone, department, student_section, batch } = student;
    return { name, email, rollNumber: roll_no, registerNumber: register_no, phone, department, student_section,batch };
};
  

// Function to find Department ID by department name
export const findDepartmentId = async (departmentName) => {
  try {
    const department = await Department.findOne({ dept_name: departmentName });
    return department ? department._id : null;
  } catch (error) {
    console.error('Error finding department:', error);
    throw error;
  }
};

// Function to find Batch ID by department ID and batch name
export const findBatchId = async (departmentId, batchName) => {
  try {
    const batch = await Batch.findOne({ batch_name: batchName, 'department': departmentId });
    return batch ? batch._id : null;
  } catch (error) {
    console.error('Error finding batch:', error);
    throw error;
  }
};

// Function to find Section ID by batch ID and section name
export const findSectionId = async (batchId, sectionName) => {
  try {
    const section = await Section.findOne({ section_name: sectionName, 'batch': batchId });
    return section ? section._id : null;
  } catch (error) {
    console.error('Error finding section:', error);
    throw error;
  }
};
