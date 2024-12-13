import Student from '../models/student.model.js'; // Assuming you have a Student model
import Defaulter from '../models/defaulter.model.js'; //
import Staff from '../models/staff.model.js'; //
export const getStudentDetailsByRollNo = async (req, res) => {
    //.log('entered getStudentDetailsByRollNo');
    //.log('Received roll_no:', req.params.roll_no); // Log roll_no to verify
  
    try {
      const { roll_no } = req.params;
  
      // Find the student entry based on roll_no in the Student collection
      const studentdata = await Student.findOne({ roll_no })
        .populate('departmentId', 'dept_name')   // Populate department name
        .populate('batchId', 'batch_name');       // Populate batch name
  
      //.log('Student Data:', studentdata); // Log the student data
  
      if (!studentdata) {
        return res.status(404).json({ message: 'Student not found' });
      }

      function getSemesterFromMonth() {
        const currentMonth = new Date().getMonth(); // getMonth() returns 0-11 (Jan=0, Dec=11)
        
        // Determine semester
        if (currentMonth >= 6 && currentMonth <= 11) {
          return 'Odd';  // July (6) - December (11)
        } else {
          return 'Even'; // January (0) - June (5)
        }
      }
      
      //.log(getSemesterFromMonth());
      

      function getYearByBatch(batch) {
        const currentYear = new Date().getFullYear();
        
        // Split the batch into start and end years
        const [startYear, endYear] = batch.split('-').map(Number);
        
        // Calculate the current year in the batch
        if (currentYear < startYear) {
          return 'Not yet started';  // Before the batch starts
        } else if (currentYear > endYear) {
          return 'Batch completed';  // After the batch ends
        } else {
          return currentYear - startYear + 1;  // Calculate current year in batch
        }
      }
      
  
      
      return res.status(200).json({
        name: studentdata.name,
        section_name: studentdata.section_name,
        batch_name: studentdata.batchId ? studentdata.batchId.batch_name : 'N/A', // Access batch name after population
        department_name: studentdata.departmentId ? studentdata.departmentId.dept_name : 'N/A',
        year:getYearByBatch(studentdata.batchId ? studentdata.batchId.batch_name : 'N/A' ),
        semester:getSemesterFromMonth(),
        mentorName:"Murali(Default)"// Access department name after population
      });
    } catch (error) {
      console.error('Error fetching student details:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  export const markDefaulter = async (req, res) => {
    console.log("Entered markDefaulter")
    const {
        rollNumber,
        entryDate,
        timeIn,
        observation,
        mentorId,
        defaulterType,
    } = req.body;

    try {
        // Check if an entry already exists for the given roll number and date
        const existingEntry = await Defaulter.findOne({ roll_no:rollNumber, entryDate });

        if (existingEntry) {
            return res.status(400).json({ message: 'Entry already exists for this date' });
        }

        // Determine defaulterType based on conditions
        // let defaulterType = '';
        // if (isLateChecked && isDressCodeChecked) {
        //     defaulterType = 'Late and Discipline';
        // } else if (isLateChecked) {
        //     defaulterType = 'Late';
        // } else if (isDressCodeChecked) {
        //     defaulterType = 'Discipline and Dresscode';
        // } else {
        //     return res.status(400).json({ message: 'No defaulter type specified' });
        // }

        // Create a new defaulter entry
        const newDefaulter = new Defaulter({
            roll_no:rollNumber,
            entryDate,
            timeIn,
            observation,
            mentorId:"675bba5d0446ab866eb26986",
            defaulterType,
        });

        const savedDefaulter = await newDefaulter.save();

        return res.status(200).json({
            message: 'Defaulter marked successfully',
            defaulter: savedDefaulter,
        });
    } catch (error) {
        console.error('Error marking defaulter:', error);
        return res.status(500).json({
            message: 'Server error',
            error: error.message,
        });
    }
};
  
export const getDefaulterReport = async (req, res) => {
  const { fromDate, toDate, defaulterType } = req.params;

  try {
    // Convert fromDate and toDate to Date objects
    const from = new Date(fromDate);
    const to = new Date(toDate);

    console.log(from,to)

    // Check if dates are valid
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // Build the query object for Defaulter
    let query = {
      entryDate: {
        $gte: from, // Greater than or equal to fromDate
        $lte: to,   // Less than or equal to toDate
      },
    };

    // Add defaulterType to the query if specified
    if (defaulterType) {
      query.defaulterType = defaulterType;
    }
    
    if (defaulterType === "All") {
      query.defaulterType = { $in: ["Late", "Discipline and Dresscode", "Both"] };
    }
    

    // Fetch defaulters based on the query
    const defaulters = await Defaulter.find(query)
      .populate('mentorId', 'name')  // Populate the mentor's name using mentorId
      .select('roll_no entryDate observation mentorId defaulterType');

    if (defaulters.length === 0) {
      return res.status(404).json({ message: 'No defaulters found for the given criteria' });
    }

    // For each defaulter, find the student details using roll_no
    const defaulterReport = [];
    for (const defaulter of defaulters) {
      const student = await Student.findOne({ roll_no: defaulter.roll_no })
        .select('roll_no name section_name batchId departmentId');  // Select relevant fields for student

      // Populate department and batch details for the student
      await student.populate('batchId', 'batch_name');
      await student.populate('departmentId', 'dept_name');

      function getYearByBatch(batch) {
        const currentYear = new Date().getFullYear();
        
        // Split the batch into start and end years
        const [startYear, endYear] = batch.split('-').map(Number);
        
        // Calculate the current year in the batch
        if (currentYear < startYear) {
          return 'Not yet started';  // Before the batch starts
        } else if (currentYear > endYear) {
          return 'Batch completed';  // After the batch ends
        } else {
          return currentYear - startYear + 1;  // Calculate current year in batch
        }
      }
    
      // Create a report entry
      defaulterReport.push({
        roll_no: defaulter.roll_no,
        studentName: student ? student.name : 'N/A',
        batchName: student.batchId ? student.batchId.batch_name : 'N/A',
        departmentName: student.departmentId ? student.departmentId.dept_name : 'N/A',
        section_name:student ? student.section_name:'N/A',
        entryDate: defaulter.entryDate,
        observation: defaulter.observation,
        mentorName:'Murali(Default)',
        defaulterType: defaulter.defaulterType,
        year:getYearByBatch(student.batchId.batch_name)
      });
    }
    console.log(defaulterReport.name)
    // Return the defaulter report
    return res.status(200).json({
      message: 'Defaulter report retrieved successfully',
      defaulterReport,
    });
  } catch (error) {
    console.error('Error fetching defaulter report:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};


