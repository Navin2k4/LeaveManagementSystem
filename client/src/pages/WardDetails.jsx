import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const WardDetails = () => {
  const [rollNo, setRollNo] = useState("");
  const [wardDetails, setWardDetails] = useState([]);
  const [searchInitiated, setSearchInitiated] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleChange = (event) => {
    const roll = event.target.value;
    setRollNo(roll.toUpperCase());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSearchInitiated(true);
    try {
      const res = await fetch(`/api/getWardDetailsByRollNumber/${rollNo}`);
      if (!res.ok) {
        throw new Error("Could Not Get WardDetailsByRollNumber");
      }
      const data = await res.json();
      setWardDetails(data);
    } catch (error) {
      console.error("Error fetching the WardDetailsByRollNumber : ", error);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center mt-16 px-4 min-h-[calc(100vh-80px)]">
        <form className="flex items-center mb-8" onSubmit={handleSubmit}>
          <input
            type="text"
            className="block px-4 py-2 border rounded-lg shadow-md focus:outline-none  focus:ring-0"
            placeholder="Eg. 22CSEB01"
            name="rollNo"
            onChange={handleChange}
          />
          <button className="ml-2 bg-[#244784] text-white px-4 py-2 border rounded-lg shadow-md transition duration-300">
            <FaSearch className="w-5 h-5" />
          </button>
        </form>

        <div className="w-full max-w-4xl overflow-x-auto">
          {searchInitiated && wardDetails.length === 0 ? (
            <div className="text-lg text-gray-600 text-center">
              No Ward Details Found for Roll Number {rollNo}
            </div>
          ) : wardDetails.length > 0 ? (
            <Table className="bg-white rounded-lg shadow-lg">
              <TableHead>
                <TableHeadCell className="p-4 bg-[#244784] text-white text-center">
                  Ward Roll Number
                </TableHeadCell>
                <TableHeadCell className="p-4 bg-[#244784] text-white text-center">
                  Ward Section
                </TableHeadCell>
                <TableHeadCell className="p-4 bg-[#244784] text-white text-center">
                  From - To
                </TableHeadCell>
                <TableHeadCell className="p-4 bg-[#244784] text-white text-center">
                  Duration
                </TableHeadCell>
                <TableHeadCell className="p-4 bg-[#244784] text-white text-center">
                  Status
                </TableHeadCell>
                <TableHeadCell className="p-4 bg-[#244784] text-white text-center">
                  Reason
                </TableHeadCell>
              </TableHead>
              <TableBody className="divide-y divide-gray-200">
                {wardDetails.map((req, index) => {
                  const sectionName = req.section_name.split(' - ').pop();
                  return (
                    <TableRow key={index}>
                      <TableCell className="p-4 text-black font-medium text-center">
                        {req.rollNo}
                      </TableCell>
                      <TableCell className="p-4 text-black font-medium text-center">
                        {sectionName}
                      </TableCell>
                      <TableCell className="p-4 text-black font-medium text-center">
                        <div className="flex gap-3 items-center justify-center">
                          <div>{formatDate(req.fromDate)}</div>
                          <div>-</div>
                          <div>{formatDate(req.toDate)}</div>
                        </div>
                      </TableCell>
                      <TableCell className="p-4 text-black font-medium text-center">
                        {req.noOfDays} days
                      </TableCell>
                      <TableCell className="p-4 text-black font-medium text-center">
                        {req.status}
                      </TableCell>
                      <TableCell className="p-4 text-black font-medium text-center">
                        {req.reason}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : null}
          {wardDetails.filter(req => req.status === 'Approved').length > 2 && (
            <h1 className="mt-6 text-red-600 font-bold text-xl text-center">
              Advise your Ward to avoid taking unnecessary leaves
            </h1>
          )}
        </div>
      </div>
    </>
  );
};

export default WardDetails;
