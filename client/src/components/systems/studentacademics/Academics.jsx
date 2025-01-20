import React, { useState } from "react";
import SemesterResults from "./SemesterResults";

const Academics = ({ student }) => {
  const [updatedStudent, setUpdatedStudent] = useState(student);
  const handleResultsUpdate = (newResults) => {
    setUpdatedStudent((prev) => ({
      ...prev,
      semester_results: newResults,
    }));
  };

  return (
    <div className="w-full mx-auto p-4">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Academics
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            View and manage your academic results
          </p>
        </div>
      </div>
      <SemesterResults
        student={updatedStudent}
        department={student.departmentId}
        onResultsSave={handleResultsUpdate}
      />
    </div>
  );
};

export default Academics;
