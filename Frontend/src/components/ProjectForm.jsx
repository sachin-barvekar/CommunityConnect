import React, { useState } from 'react';
import PropTypes from 'prop-types';

export default function ProjectFormPage({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: '', 
    imageFile: null,
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      imageFile: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); 
    try {
      const formDataWithFile = new FormData();
      formDataWithFile.append('title', formData.title);
      formDataWithFile.append('description', formData.description);
      formDataWithFile.append('startDate', formData.startDate);
      formDataWithFile.append('status', formData.status);
      formDataWithFile.append('image', formData.imageFile);

      if (formData.status === 'Completed') {
        formDataWithFile.append('endDate', formData.endDate);
      }

      const response = await fetch('/api/v1/projects', {
        method: 'POST',
        body: formDataWithFile,
      });

      if (!response.ok) {
        throw new Error('Failed to submit project');
      }

      const data = await response.json();
      onSubmit(data.project);
      onClose();
      alert('Project created successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error submitting project:', error.message);
      setError('Failed to submit project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-0 flex flex-col items-center">
      <div className="flex justify-center items-center mb-2 w-full max-w-2xl mx-auto">
        <h1 className="text-3xl text-center font-semibold my-7">Add Project</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full sm:max-w-2xl lg:max-w-3xl mx-auto">
        <input
          type="text"
          placeholder="Title"
          className="border p-3 rounded-lg"
          id="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          placeholder="Description"
          className="border p-3 rounded-lg"
          id="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date
        </label>
        <input
          type="date"
          placeholder="Start Date"
          className="border p-3 rounded-lg"
          id="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
        />
        <select
          id="status"
          value={formData.status}
          onChange={handleChange}
          className="border p-3 rounded-lg"
          required
        >
          <option value="" disabled>Select Status</option>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        {formData.status === 'Completed' && (
          <>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              placeholder="End Date"
              className="border p-3 rounded-lg"
              id="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </>
        )}
        <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">
          Upload Image
        </label>
        <input
          type="file"
          id="imageFile"
          accept="image/*"
          className="border p-3 rounded-lg"
          onChange={handleImageChange}
          required
        />
        <button
          type="submit"
          className={`bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Adding Project...' : 'Add Project'}
        </button>
      </form>
      {error && (
        <div className="text-red-500 mt-3">
          <p>Error: {error}</p>
        </div>
      )}
      <div className="flex gap-2 mt-5">
        <p>Back to Projects?</p>
        <button onClick={onClose} className="text-blue-700">Go to Projects</button>
      </div>
    </div>
  );
}

ProjectFormPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
