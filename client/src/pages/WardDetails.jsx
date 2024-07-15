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
    const options = { year : 'numeric', month : 'long', day : 'numeric'};
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const handleChange = (event) => {
    const roll = event.target.value
    setRollNo(roll.toUpperCase());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSearchInitiated(true);
    try {
      const res = await fetch(`api/getWardDetailsByRollNumber/${rollNo}`);
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
      <div className="flex flex-row justify-center items-center mt-20 max-h-screen">
        <form className="flex items-center" onSubmit={handleSubmit}>
          <input
            type="text"
            className="block px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="Eg. 22CSEB01"
            name="rollNo"
            onChange={handleChange}
          />
          <button className="bg-white flex items-center justify-center px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ml-1 border-gray-600">
            <FaSearch className="w-5 h-6" />
          </button>
        </form>
      </div>
      <div className="flex flex-row justify-center items-center mt-5 max-h-screen">
        <div className="overflow-x-auto">
          {searchInitiated && wardDetails.length === 0 ? (
            <div>No Ward Details Found for Roll Number {rollNo}</div>
          ) : wardDetails.length > 0 ? (
            <Table className="bg-white rounded-sm">
              <TableHead>
                <TableHeadCell className="p-4 bg-primary-blue text-center text-white">
                  Ward Roll Number
                </TableHeadCell>
                <TableHeadCell className="p-4 bg-primary-blue text-center text-white">
                  Ward Section
                </TableHeadCell>
                <TableHeadCell className="p-4 bg-primary-blue text-center text-white">
                  Reason
                </TableHeadCell>
                <TableHeadCell className="p-4 bg-primary-blue text-center text-white">
                  Start Date
                </TableHeadCell>
                <TableHeadCell className="p-4 bg-primary-blue text-center text-white">
                  End Date
                </TableHeadCell>
                <TableHeadCell className="p-4 bg-primary-blue text-center text-white">
                  Duration
                </TableHeadCell>
                <TableHeadCell className="p-4 bg-primary-blue text-center text-white">
                  Status
                </TableHeadCell>
              </TableHead>
              <TableBody className="divide-y">
                {wardDetails.map((req, index) => {
                  const sectionName = req.section_name.split(' - ').pop();
                  return (
                    <TableRow key={index}>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                        {req.rollNo}
                      </TableCell>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                        {sectionName}
                      </TableCell>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                        {formatDate(req.fromDate)}
                      </TableCell>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                        {formatDate(req.toDate)}
                      </TableCell>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                        {req.noOfDays} days
                      </TableCell>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                        {req.status}
                      </TableCell>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                        {req.reason}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : null}
          {wardDetails.filter(req => req.status === 'Approved').length > 2 && (
              <h1 className="flex flex-col text-red-600 font-bold text-2xl">Advise your Ward to avoid taking unnecessary leaves</h1>
          )}
        </div>
      </div>
    </>
  );
};

export default WardDetails;
