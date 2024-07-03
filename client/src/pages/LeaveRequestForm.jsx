import React, { useEffect, useState } from "react";
import { TextInput, Label, Button, Select } from "flowbite-react";
import { useSelector } from "react-redux";

export default function LeaveRequestForm() {
  const [years, setYears] = useState([]);
  const [departments, setDepartments] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [classIncharges, setClassIncharges] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    userId:currentUser.student._id,
    rollNo: "",
    regNo: "",
    year: "",
    section: "",
    department: "",
    reason: "",
    classInchargeId: "",
    mentorId: "",
    leaveStartDate: "",
    leaveEndDate: "",
  });
  
  console.log("Departments",departments);
  console.log("Batches",batches);
  console.log("Sections",sections);
  console.log("Mentors",mentors);
  console.log("ClassIncharges",classIncharges);
  console.log("FormData",formData);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 4;
    const endYear = startYear + 4;
    const yearOptions = [];
    for (let year = startYear; year <= endYear; year++) {
      yearOptions.push(`${year}-${year + 4}`);
    }
    setYears(yearOptions);
  }, []);

  useEffect(() => {
    fetch("/api/departments")
      .then((response) => response.json())
      .then((data) => setDepartments(data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (formData.section) {
      const fetchStaff = async () => {
        try {
          const resMentor = await fetch(
            `/api/sections/${formData.section}/mentors`
          );
          const mentorsData = await resMentor.json();
          setMentors(mentorsData);

          const resClassIncharge = await fetch(
            `/api/sections/${formData.section}/classIncharges`
          );
          const classInchargesData = await resClassIncharge.json();
          setClassIncharges(classInchargesData);

          // Set classInchargeId in formData
          if (classInchargesData.length > 0) {
            setFormData({
              ...formData,
              classInchargeId: classInchargesData[0]._id,
            });
          }
        } catch (error) {
          console.error(error);
        }
      };

      fetchStaff();
    } else {
      setMentors([]);
      setClassIncharges([]);
    }
  }, [formData.section]);

  const handleDepartmentChange = async (e) => {
    const deptId = e.target.value;
    setFormData({ ...formData, department: deptId });

    try {
      const res = await fetch(`/api/departments/${deptId}/batches`);
      const data = await res.json();
      setBatches(data);
      setSections([]);
      setMentors([]);
      setClassIncharges([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBatchChange = async (e) => {
    const batchId = e.target.value;
    setFormData({ ...formData, year: batchId });

    try {
      const res = await fetch(`/api/batches/${batchId}/sections`);
      const data = await res.json();
      setSections(data);
      setMentors([]);
      setClassIncharges([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSectionChange = (e) => {
    const sectionId = e.target.value;
    setFormData({ ...formData, section: sectionId });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/leave-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-custom-gray font-sans shadow-lg my-3 rounded px-8 pt-6 pb-8 mb-4 max-w-5xl w-full">
        <div className="flex justify-center space-x4 mb-4">
          <h1 className="text-custom-div-bg font-bold text-2xl px-6 py-2 tracking-wide">
            Leave Form
          </h1>
        </div>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <Label
              htmlFor="name"
              className="mb-2 text-left font-bold tracking-wide"
            >
              Name
            </Label>
            <TextInput
              type="text"
              name="name"
              placeholder="Dinesh Kumar K K"
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <Label
                htmlFor="rollNo"
                className="text-left font-bold tracking-wide"
              >
                Roll No
              </Label>
              <TextInput
                type="text"
                name="rollNo"
                placeholder="22CSEB35"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label
                htmlFor="regNo"
                className="text-left font-bold tracking-wide"
              >
                Register Number
              </Label>
              <TextInput
                type="text"
                name="regNo"
                placeholder="913122104103"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
            <div className="flex flex-col">
              <Label
                htmlFor="department"
                className="mb-2 text-left font-bold tracking-wide"
              >
                Department
              </Label>
              <Select
                name="department"
                defaultValue=""
                onChange={handleDepartmentChange}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.dept_name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex flex-col gap-3">
              <Label
                htmlFor="year"
                className="block text-sm font-medium text-gray-700"
              >
                Batch
              </Label>
              <Select
                name="year"
                id="year"
                onChange={handleBatchChange}
                required
                className="w-full tracking-wider"
              >
                <option value="">Select Batch</option>
                {batches.map((batch) => (
                  <option key={batch._id} value={batch._id}>
                    {batch.batch_name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-3">
              <Label
                htmlFor="section"
                className="text-left font-bold tracking-wide"
              >
                Section
              </Label>
              <Select
                name="section"
                defaultValue=""
                onChange={handleSectionChange}
              >
                <option value="">Select Section</option>
                {sections.map((section) => (
                  <option key={section._id} value={section._id}>
                    {section.section_name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <Label
                htmlFor="mentorId"
                className="text-left font-bold tracking-wide"
              >
                Mentor Name
              </Label>
              <Select name="mentorId" defaultValue="" onChange={handleChange}>
                <option value="">Select Mentor</option>
                {mentors.map((mentor) => (
                  <option key={mentor._id} value={mentor._id}>
                    {mentor.staff_name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-3">
              <Label
                htmlFor="classInchargeId"
                className="text-left font-bold tracking-wide"
              >
                Class Incharge Name
              </Label>
              <TextInput
                type="text"
                name="classInchargeId"
                value={classIncharges.length > 0 ? classIncharges[0].staff_name : ''}
                readOnly
                className="rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <Label
                htmlFor="leaveStartDate"
                className="text-left font-bold tracking-wide"
              >
                {" "}
                Date From
              </Label>
              <TextInput
                type="date"
                name="leaveStartDate"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label
                htmlFor="leaveEndDate"
                className="text-left font-bold tracking-wide"
              >
                Date To
              </Label>
              <TextInput
                type="date"
                name="leaveEndDate"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label
              htmlFor="reason"
              className="text-left font-bold tracking-wide"
            >
              Reason
            </Label>
            <textarea
              name="reason"
              cols="30"
              rows="4"
              onChange={handleChange}
            ></textarea>
          </div>
          <Button
            type="submit"
            className="text-white p-2 font-bold tracking-wide rounded-md"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}
