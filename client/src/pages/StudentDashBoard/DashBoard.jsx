import React from 'react';
import './DashBoard.scss'; // Fixed typo in file name

const requestsData = [
  { id: 1, appliedDate: '2024-07-01', numberOfDays: 2, fromDate: '2024-07-03', toDate: '2024-07-04', status: 'Approved' },
  { id: 2, appliedDate: '2024-07-05', numberOfDays: 1, fromDate: '2024-07-06', toDate: '2024-07-06', status: 'Pending' },
];

const DashBoard = () => {
  return (
    <div className='dashBoard-container '>
      <div className='left-container'>
        <h1>Requests On Queue</h1>
        <ul>
          {requestsData.map(request => (
            <li key={request.id}>
              <div className="request-item">
                <div className="request-info">
                  <div className="date-info">
                    <div className="label">Applied Date:</div>
                    <div>{request.appliedDate}</div>
                  </div>
                  <div className="days-info">
                    <div className="label">Number of Days:</div>
                    <div>{request.numberOfDays}</div>
                  </div>
                  <div className="date-range-info">
                    <div className="label">From - To:</div>
                    <div>{request.fromDate} to {request.toDate}</div>
                  </div>
                </div>
                <div className={`status ${request.status.toLowerCase()}`}>{request.status}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className='right-container'>
        <h1>Approved Requests This Month</h1>
        <ul>
          {requestsData
            .filter(request => request.status.toLowerCase() === "approved")
            .map(request => (
              <li key={request.id}>
                <div className="request-item">
                  <div className="request-info">
                    <div className="date-info">
                      <div className="label">Applied Date:</div>
                      <div>{request.appliedDate}</div>
                    </div>
                    <div className="days-info">
                      <div className="label">Number of Days:</div>
                      <div>{request.numberOfDays}</div>
                    </div>
                    <div className="date-range-info">
                      <div className="label">From - To:</div>
                      <div>{request.fromDate} to {request.toDate}</div>
                    </div>
                  </div>
                  <div className={`status ${request.status.toLowerCase()}`}>{request.status}</div>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default DashBoard;
