export const extractStudentDetails = (student) => {
    const { name, email, roll_no, register_no, phone, department, student_section, batch } = student;
    return { name, email, rollNumber: roll_no, registerNumber: register_no, phone, department, student_section,batch };
};
  