import React, { useState } from "react";
import StudentAnalytics from "./StudentAnalytics";

const Academics = ({ student }) => {
  const [updatedStudent, setUpdatedStudent] = useState(student);
  const handleResultsUpdate = (newResults) => {
    setUpdatedStudent((prev) => ({
      ...prev,
      semester_results: newResults,
    }));
  };

  return (
    <div className="w-full mx-auto">
      <StudentAnalytics
        student={updatedStudent}
        department={student.departmentId}
        onResultsSave={handleResultsUpdate}
      />
    </div>
  );
};

export default Academics;
