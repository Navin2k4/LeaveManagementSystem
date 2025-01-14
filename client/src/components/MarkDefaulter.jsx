import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MarkDefaulterAndLate = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [selectedMentor, setSelectedMentor] = useState('');
  const [timeIn, setTimeIn] = useState('');
  const [formData, setFormData] = useState({
    studentName: '',
    academicYear: '',
    semester: '',
    year: '',
    department: '',
    entryDate: new Date().toISOString().split('T')[0],
    timeIn: '',
    observation: '',
    mentorName: 'Default',
    defaulterType: '',
    rollNumber: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (rollNumber) {
      fetchStudentData();
      // fetchMentorData();
    } else {
      resetForm();
    }
  }, [rollNumber]);

  const fetchStudentData = async () => {
    try {
      const formattedRollNumber = rollNumber.toUpperCase();
      const response = await fetch(
        `/api/defaulter/getStudentDetailsByRollforDefaulters/${formattedRollNumber}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      if (data && data.name) {
        setFormData(prev => ({
          ...prev,
          studentName: data.name || 'N/A',
          academicYear: data.batch_name || 'N/A',
          semester: data.semester || 'N/A',
          year: data.year || 'N/A',
          department: data.department_name || 'N/A',
          mentorName: data.mentorName || 'N/A',
          rollNumber: formattedRollNumber
        }));
      } else {
        resetForm();
        setError('Student not found');
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      setError('Error fetching student data');
      resetForm();
    }
  };


  //TO HANDLE IT AFTER ADDING STUDENTS DATA IN MENTOR IN DB

  // const fetchMentorData = async () => {
  //   try {
  //     const formattedRollNumber = rollNumber.toUpperCase();
  //     const response = await axios.get(`http://localhost:5000/mentor?rollNumber=${formattedRollNumber}`);
  //     const data = response.data;
  //     if (data && data.mentorName) {
  //       setSelectedMentor(data.mentorName);
  //       setFormData(prev => ({
  //         ...prev,
  //         mentorName: data.mentorName
  //       }));
  //     } else {
  //       setError('Mentor not found');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching mentor data:', error);
  //     setError('Error fetching mentor data');
  //   }
  // };

  const handleChange = (e) => {
    const { name, value, type, id } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'radio' ? id : value
    }));

    if (name === 'rollNumber') {
      setRollNumber(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
  
    try {
      const payload = {
        rollNumber: formData.rollNumber,
        entryDate: formData.entryDate,
        timeIn: formData.timeIn,
        observation: formData.observation,
        mentorName: "675bba5d0446ab866eb26986",
        defaulterType: formData.defaulterType === 'lateEntry' ? 'Late': formData.defaulterType === 'dressCode' ? 'Discipline and Dresscode' : formData.defaulterType === 'both' ? 'Both' : "",
      };
      
      const response = await fetch('/api/defaulter/markDefaulter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (response.status === 200) {
        const result = await response.json();
        alert(setSuccessMessage(result.message));
        resetForm();
      } else {
        const err=await response.json();
        setError(err.message||"aa");
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to submit form: ' + error.message);
    }
  };
  
  
  const resetForm = () => {
    setFormData({
      studentName: '',
      academicYear: '',
      semester: '',
      year: '',
      department: '',
      entryDate: new Date().toISOString().split('T')[0],
      timeIn: '',
      observation: '',
      mentorName: '',
      defaulterType: '',
      // rollNumber: ''
    });
    setSelectedMentor('');
    setTimeIn('');
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Mark Defaulter and Late Entry</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="col-span-2">
            <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Roll Number
            </label>
            <input
              type="text"
              id="rollNumber"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              required
            />
          </div>
          <div className='grid grid-cols-2 gap-3'>

          {['studentName', 'academicYear', 'semester', 'year', 'department','mentorName'].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type="text"
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-2 text-sm border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                readOnly
              />
            </div>
          ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Defaulter Type</label>
          <div className="flex space-x-4">
            {['dressCode', 'lateEntry', 'both'].map((type) => (
              <label key={type} className="inline-flex items-center">
                <input
                  type="radio"
                  id={type}
                  name="defaulterType"
                  checked={formData.defaulterType === type}
                  onChange={handleChange}
                  className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                  required
                />
                <span className="ml-2 text-sm text-gray-700">
                  {type === 'dressCode' ? 'Dress Code' : type === 'lateEntry' ? 'Late Entry' : 'Both'}
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="entryDate" className="block text-sm font-medium text-gray-700 mb-1">
              Entry Date
            </label>
            <input
              type="date"
              id="entryDate"
              name="entryDate"
              value={formData.entryDate}
              onChange={handleChange}
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              required
            />
          </div>
          <div>
            <label htmlFor="timeIn" className="block text-sm font-medium text-gray-700 mb-1">
              Time In
            </label>
            <input
              type="time"
              id="timeIn"
              name="timeIn"
              min=""
              max="16.00"
              value={formData.timeIn}
              onChange={handleChange}
              className={`w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out ${formData.defaulterType === 'dressCode' ? 'bg-gray-200' : ''}`}
              required={formData.defaulterType !== 'dressCode'}
              disabled={formData.defaulterType === 'dressCode'}
            />
          </div>
        </div>

        <div>
          <label htmlFor="observation" className="block text-sm font-medium text-gray-700 mb-1">
            Observation
          </label>
          <textarea
            id="observation"
            name="observation"
            value={formData.observation}
            onChange={handleChange}
            className={`w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out ${formData.defaulterType === 'lateEntry' ? 'bg-gray-200' : ''}`}
            rows="3"
            required={formData.defaulterType !== 'lateEntry'}
            disabled={formData.defaulterType === 'lateEntry'}
          />
        </div>

      

        

        <div className="text-center mt-6">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            Submit
          </button>
        </div>
      </form>

      {error && <div className="mt-4 text-red-500 text-center text-sm">{error}</div>}
      {successMessage && <div className="mt-4 text-green-500 text-center text-sm">{successMessage}</div>}
    </div>
  );
};

export default MarkDefaulterAndLate;