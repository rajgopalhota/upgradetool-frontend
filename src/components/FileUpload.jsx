import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ResponseComponent from './ResponseComponent';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await axios.post('http://localhost:8080/api/analyze/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      localStorage.setItem('response', JSON.stringify(result.data));
      setResponse(result.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setResponse(null); // Clear response when canceling
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
  };

  useEffect(() => {
    AOS.init();
  }, []);

  // Render ResponseComponent if response is available
  if (response) {
    return <ResponseComponent response={response} onCancel={handleCancel} />;
  }

  return (
    <div
      className={'flex flex-col items-center justify-center h-screen'}
      data-aos="fade-up"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {!file ? (
        <div className="rounded-lg border-4 border-blue-500 p-4">
          <input
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept=".zip"
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer text-blue-600 hover:text-blue-800"
          >
            Click here or drag a ZIP file to upload
          </label>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg font-medium">Selected file: {file.name}</p>
          <div className="mt-4">
            <button
              onClick={handleUpload}
              className="bg-sky-600 text-white p-2 rounded hover:bg-sky-700 mr-2"
            >
              Upload
            </button>
            <button
              onClick={handleCancel}
              className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
