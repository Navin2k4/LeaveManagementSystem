import React, { useState } from 'react';
import { Button, Table, Modal } from 'react-bootstrap';
import * as XLSX from 'xlsx';

const UploadExcel = () => {
  const [file, setFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  // Handle file upload
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      readExcelFile(uploadedFile);
    }
  };

  // Read the Excel file and parse it into JSON
  const readExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      setExcelData(sheetData);
    };
    reader.readAsBinaryString(file);
  };

  // Handle file upload to the server using fetch
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/data/uploadData', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('File uploaded successfully');
        setFile(null);
        setExcelData([]);
      } else {
        alert('Error uploading file');
      }
    } catch (error) {
      console.error(error);
      alert('Error uploading file');
    }
  };

  return (
    <div className="container py-4">
      <h2 className="font-bold text-lg mb-4">Upload Student Data</h2>

      <div className="flex gap-3 mb-3">
        <label htmlFor="file-upload" className="bg-gray-600 text-white p-3 rounded cursor-pointer">
          Choose File
          <input
            id="file-upload"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <Button
          className="bg-blue-500 p-3 text-white rounded"
          disabled={!file}
          onClick={() => setShowPreview(true)}
        >
          View Data
        </Button>

        <Button
          variant="success"
          className="bg-green-500 text-white p-3 rounded"
          disabled={!file}
          onClick={handleSubmit}
        >
          Upload
        </Button>
        {file && <p className='font-bold pt-3'>Uploaded file: {file.name}</p>}

      </div>

      {/* Preview Modal */}
      <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg">
        <Modal.Header closeButton className="bg-gray-800 text-white">
          <Modal.Title className='pt-2 font-bold'>Excel File Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="overflow-auto max-h-80">
          {excelData.length > 0 ? (
            <Table striped bordered hover responsive className="border-collapse w-full">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Roll No</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Department Acronym</th>
                  <th className="px-4 py-2 text-left">Year</th>
                  <th className="px-4 py-2 text-left">Section</th>
                  <th className="px-4 py-2 text-left">Mentor</th>
                  <th className="px-4 py-2 text-left">Class Incharge</th>
                  <th className="px-4 py-2 text-left">Register No</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                </tr>
              </thead>
              <tbody>
                {excelData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-4 py-2">{row.roll_no}</td>
                    <td className="px-4 py-2">{row.name}</td>
                    <td className="px-4 py-2">{row.dept_acronym}</td>
                    <td className="px-4 py-2">{row.year}</td>
                    <td className="px-4 py-2">{row.sec}</td>
                    <td className="px-4 py-2">{row.mentor}</td>
                    <td className="px-4 py-2">{row.classincharge}</td>
                    <td className="px-4 py-2">{row.register_no}</td>
                    <td className="px-4 py-2">{row.email}</td>
                    <td className="px-4 py-2">{row.phone}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center p-8">No data to display.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className='m-6 flex flex-row justify-end gap-3'>
          <Button className='bg-blue-700 text-white py-2 px-4 rounded-lg' onClick={() => setShowPreview(false)}>
            Close
          </Button>
          <Button className='bg-green-700 text-white py-2 px-4 rounded-lg' onClick={handleSubmit}>
            Upload
          </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UploadExcel;
