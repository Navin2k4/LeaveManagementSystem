import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { ChevronRight } from "lucide-react";

const WardDetails = () => {
  const [rollNo, setRollNo] = useState("");
  const [wardDetails, setWardDetails] = useState([]);
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status, type) => {
    if (type === "Defaulter") return "bg-red-100 text-red-800 border-red-200";
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Leave":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "OD":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Defaulter":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleChange = (event) => {
    const roll = event.target.value;
    setRollNo(roll.toUpperCase());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSearchInitiated(true);
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/api/fetch/getWardDetailsByRollNumber/${rollNo}`
      );
      if (!res.ok) {
        throw new Error("Could not fetch ward details");
      }
      const data = await res.json();
      setWardDetails(data);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch ward details");
    } finally {
      setIsLoading(false);
    }
  };

  const MobileRecordCard = ({ record }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(
                  record.type
                )}`}
              >
                {record.type}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                  record.status,
                  record.type
                )}`}
              >
                {record.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {new Date(record.fromDate).toLocaleDateString()}
              {record.fromDate !== record.toDate &&
                ` - ${new Date(record.toDate).toLocaleDateString()}`}
            </p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors"
          >
            <ChevronRight
              size={20}
              className={`transform transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Duration
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {record.noOfDays} day(s)
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Details
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {record.type === "Defaulter"
                  ? record.defaulterType
                  : record.reason}
                {record.type === "Defaulter" && record.timeIn && (
                  <span className="block text-xs text-gray-500 mt-1">
                    Time: {record.timeIn}
                  </span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Ward Details
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Monitor your ward's attendance and activities
          </p>
        </div>

        {/* Search Form */}
        <div className="mb-8">
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
            <input
              type="text"
              className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              placeholder="Enter Roll Number (e.g., 22CSEB01)"
              value={rollNo}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Loading...
                </div>
              ) : (
                <div className="flex items-center">
                  <FaSearch className="mr-2" />
                  Search
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="w-full">
          {error && (
            <div className="text-center text-red-600 mb-4">{error}</div>
          )}

          {searchInitiated &&
            !isLoading &&
            wardDetails.length === 0 &&
            !error && (
              <div className="text-center text-gray-600 dark:text-gray-400">
                No records found for Roll Number {rollNo}
              </div>
            )}

          {wardDetails.length > 0 && (
            <>
              {/* Desktop view */}
              <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Date Range
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {wardDetails.map((record, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            {record.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(
                                record.type
                              )}`}
                            >
                              {record.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                              {new Date(record.fromDate).toLocaleDateString()}
                              {record.fromDate !== record.toDate &&
                                ` - ${new Date(
                                  record.toDate
                                ).toLocaleDateString()}`}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                              {record.noOfDays} day(s)
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                                record.status,
                                record.type
                              )}`}
                            >
                              {record.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                              {record.type === "Defaulter"
                                ? record.defaulterType
                                : record.reason}
                            </div>
                            {record.type === "Defaulter" && record.timeIn && (
                              <div className="text-xs text-gray-500">
                                Time: {record.timeIn}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile view */}
              <div className="md:hidden space-y-4">
                {wardDetails.map((record, index) => (
                  <MobileRecordCard key={index} record={record} />
                ))}
              </div>
            </>
          )}

          {wardDetails.filter(
            (record) => record.type === "Leave" && record.status === "approved"
          ).length > 2 && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-center font-medium">
                Please advise your ward to avoid taking unnecessary leaves
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WardDetails;
