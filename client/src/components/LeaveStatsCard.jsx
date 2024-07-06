import React from "react";

const LeaveStatsCard = () => {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg">
      <h2 className="text-3xl uppercase tracking-wider text-center font-semibold mb-8">
        Leave Statistics 
      </h2>
      <div className="mb-8 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-linkedin-blue shadow-lg p-4 rounded-lg hover:-translate-y-2 duration-500 transition-all">
            <div className="my-2 text-white text-lg font-semibold">
              <span className="">Total Requests:</span>{" "}
            </div>
            <div className="mb-2 text-white">
              <span className="font-semibold">Pending:</span>{" "}
            </div>
            <div className="mb-2 text-white">
              <span className="font-semibold">Approved:</span>{" "}

            </div>
            <div className="mb-2 text-white">
              <span className="font-semibold">Rejected:</span>{" "}

            </div>
          </div>
          <div className="bg-linkedin-blue shadow-lg p-4 rounded-lg hover:-translate-y-2 duration-500 transition-all">
            <h3 className="text-lg text-white font-semibold mb-4">
              Policies and Balances
            </h3>{" "}
            <p className="text-white">
              ** Policy change: <br /> Sick leave now requires medical
              certificate for leaves exceeding 3 days.
            </p>
          </div>
          <div className="bg-linkedin-blue shadow-lg p-4 text-white rounded-lg hover:-translate-y-2 duration-500 transition-all">
            <h3 className="text-lg font-semibold mb-4">
              Leave Approval Workflow
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a8 8 0 100 16 8 8 0 000-16zM5 10a5 5 0 1110 0 5 5 0 01-10 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="font-semibold">
                  John Doe requested Sick Leave - 2024-07-10 to
                  2024-07-12
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a8 8 0 100 16 8 8 0 000-16zM5 10a5 5 0 1110 0 5 5 0 01-10 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="font-semibold">
                  Jane Smith requested Vacation - 2024-08-01 to
                  2024-08-15
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveStatsCard;
