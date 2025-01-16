import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Calendar, CheckCircle2, AlertCircle } from "lucide-react";

const PendingWorks = () => {
  const [pendingWorks, setPendingWorks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchPendingWorks = async () => {
      try {
        const response = await fetch(
          `/api/defaulter/pendingworks/${currentUser.id}`
        );
        const data = await response.json();

        if (data.success) {
          setPendingWorks(data.pendingWorks);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error("Error fetching pending works:", error);
        setError("Failed to fetch pending works");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingWorks();
  }, [currentUser.userId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-red-500">
        <AlertCircle className="w-5 h-5 mr-2" />
        {error}
      </div>
    );
  }

  if (pendingWorks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-500">
        <CheckCircle2 className="w-12 h-12 mb-2 text-green-500" />
        <p>No pending works assigned!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-4">Your Pending Works</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pendingWorks.map((work, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  work.defaulterType === "Late"
                    ? "bg-yellow-100 text-yellow-800"
                    : work.defaulterType === "Both"
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {work.defaulterType}
              </span>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(work.entryDate).toLocaleDateString()}
              </div>
            </div>

            <div className="mt-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                Assigned Work
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-wrap">
                {work.remarks}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingWorks;
