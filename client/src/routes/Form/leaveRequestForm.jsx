import React from 'react'
import './leaveRequestForm.scss';
const LeaveRequestFormPage = () => {
  return (
    <div className="leave-form">
    <div className='form-container'>
        <h1>Fill Your Leave Form!</h1>
      <label htmlFor="username">Enter your Name</label>
        <input type="text" id="username" placeholder="eg.Vinoth Kumar K B" />
        <label htmlFor="dob">Roll Number</label>
        <input type="text" id="dob" placeholder='22CSEB01'/>
        <label htmlFor="year">Class</label>
        <select name="class" id="class">
            <option value="a">II-CSE A</option>
            <option value="b">II-CSE B</option>
            <option value="c">II-CSE C</option>
        </select>
        <label htmlFor="mentor">Mentor Name</label>
        <input type="text" id="mentor-name" placeholder="Mentor Name" />
        <label htmlFor="class-incharge-name">Class Incharge Name</label>
        <input type="text" id="class-incharge-name" placeholder="Class Incharge Name" />
        <label htmlFor="noOfDays">No.of.Days Applied</label>
        <input type="number" id="noOfDays" placeholder='No.Of.Days'/>
        <label htmlFor="from-date">Date From</label>
        <input type="date" id="from-date" placeholder='yyyy-mm-dd'/>
        <label htmlFor="to-date">Date To</label>
        <input type="date" id="to-date" placeholder='yyyy-mm-dd'/>
        <label htmlFor="reasonForLeave">Reason for Taking Leave</label>
        <textarea id="reasonForLeave" placeholder='Reason for Taking Leave'></textarea>
        <button type="submit">Apply </button>
    </div>
    </div>
  )
}

export default LeaveRequestFormPage;
