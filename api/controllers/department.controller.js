import Department from '../models/department.model.js';
import Batch from '../models/batch.model.js';
import Section from '../models/section.model.js';
import Staff from '../models/staff.model.js';

export const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().populate('batches');
    res.status(200).json(departments);
  } catch (error) {
    next(error);
  }
};

export const getDepartmentIdByName = async (req, res, next) => {
  const { departmentName } = req.params;
  try {
    const department = await Department.findOne({ dept_name: departmentName });
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json({ departmentId: department._id });
  } catch (error) {
    console.error('Error fetching department:', error);
    next(error); 
  }
};

export const getBatches = async (req, res, next) => {
  const { departmentId } = req.params;
  try {
    const department = await Department.findById(departmentId).populate('batches');
    res.status(200).json(department.batches);
  } catch (error) {
    next(error);
  }
};

export const getSections = async (req, res, next) => {
  const { batchId } = req.params;
  try {
    const batch = await Batch.findById(batchId).populate('sections');
    res.status(200).json(batch.sections);
  } catch (error) {
    next(error);
  }
};

export const getSectionIdByBatchAndName = async (req, res) => {
  const { batchId, sectionName } = req.params;
  try {
    const section = await Section.findOne({ section_name: sectionName, batch: batchId });
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }
    // Extract just the section ID
    const { _id } = section;
    // Send back only the section ID
    res.json({ sectionId: _id });
  } catch (error) {
    console.error('Error fetching section:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMentors = async (req, res, next) => {
  const { sectionId } = req.params;
  try {
    const mentors = await Staff.find({ isMentor: true,'mentorHandlingData.handlingSectionId': sectionId});
    res.status(200).json(mentors);
  } catch (error) {
    next(error);
  }
};

export const getClassIncharges = async (req, res, next) => {
  const { sectionId } = req.params;
  try {
    const classIncharges = await Staff.find({ isClassIncharge: true,classInchargeSectionId : sectionId });
    res.status(200).json(classIncharges);
  } catch (error) {
    next(error);
  }
};

export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate({
      path: 'batches',
      populate: { path: 'sections', model: 'Section' }
    });
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBatchById = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id).populate('sections');
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    res.json(batch);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSectionNameById = async (req, res, next) => {
  try {
    const { id } = req.params; // Assuming the ID is passed as a URL parameter
    const section = await Section.findById(id); // Fetch section by ID
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }
    res.status(200).json({ name: section.section_name }); // Respond with section name
  } catch (error) {
    console.error('Error fetching section name:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getDepartmentNameByCurrentUserId = async (req, res, next) => {
  const { deptId } = req.query;
  try {
    const response = await Department.findById(deptId).populate('batches');
    if(!response) {
      return res.status(400).json({ error : 'DepartMent not Found' });
    }
    res.status(200).json({ name : response.dept_name });
  } catch (error) {
    next(error);
  }
};