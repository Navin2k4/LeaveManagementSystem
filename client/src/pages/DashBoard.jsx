import React, { useEffect, useState } from 'react';
import LeaveStatus from '../components/LeaveStatus';
import { useSelector } from 'react-redux';

const DashBoard = ({ setTab }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [leaveRequests, setLeaveRequests] = useState([]);


  const id = currentUser.userType === "Student" ? currentUser.id : currentUser.userId;

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const res = await fetch(`/api/getleaverequest/${id}`);
        const data = await res.json();
        if (res.ok) {
          setLeaveRequests(data);
        }
      } catch (error) {
        console.error('Error fetching leave requests:', error);
      }
    };

    fetchLeaveRequests();
  }, [currentUser.id]);


  const updateStatus = (id, role, newStatus) => {
    // Update the status of the leave request locally
    setLeaveRequests((prevRequests) =>
      prevRequests.map((request) =>
        request._id === id ? { ...request, status: { ...request.status, [role]: newStatus } } : request
      )
    );

    // Update the status on the server
    fetch(`/api/updateleavestatus/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role, newStatus }),
    })
      .then((res) => {
        if (res.ok) {
          // Optional: Handle success
        } else {
          // Optional: Handle error
        }
      })
      .catch((error) => {
        console.error('Error updating leave status:', error);
      });
  };

  return (
    <div className="app">
      <LeaveStatus leaveRequests={leaveRequests} updateStatus={updateStatus} />
    </div>
  );
};

export default DashBoard;
