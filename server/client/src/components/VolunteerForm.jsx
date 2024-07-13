import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function VolunteerForm({ onSubmit, onClose, volunteerOpportunity }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    imageFile: null,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (volunteerOpportunity) {
      setFormData({
        title: volunteerOpportunity.title || '',
        description: volunteerOpportunity.description || '',
        date: volunteerOpportunity.date ? volunteerOpportunity.date.split('T')[0] : '',
        location: volunteerOpportunity.location || '',
        imageFile: volunteerOpportunity.image || null,
      });
    }
  }, [volunteerOpportunity]);

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
    setLoading(true);
    try {
      const formDataWithFile = new FormData();
      formDataWithFile.append('title', formData.title);
      formDataWithFile.append('description', formData.description);
      formDataWithFile.append('date', formData.date);
      formDataWithFile.append('location', formData.location);
      if (formData.imageFile instanceof File) {
        formDataWithFile.append('image', formData.imageFile);
      }

      const response = await fetch(volunteerOpportunity ? `/api/v1/volunteers/${volunteerOpportunity._id}` : '/api/v1/volunteers', {
        method: volunteerOpportunity ? 'PUT' : 'POST',
        body: formDataWithFile,
      });

      if (!response.ok) {
        throw new Error('Failed to submit volunteer opportunity');
      }

      const data = await response.json();
      onSubmit(data.volunteerOpportunity);
      onClose();
      alert(volunteerOpportunity ? 'Volunteer opportunity updated successfully' : 'Volunteer opportunity created successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error submitting volunteer opportunity:', error.message);
      setError('Failed to submit volunteer opportunity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-0 flex flex-col items-center">
      <div className="flex justify-center items-center mb-2 w-full max-w-lg mx-auto">
        <h1 className="text-3xl text-center font-semibold my-7">{volunteerOpportunity ? 'Update Volunteer Opportunity' : 'Add Volunteer Opportunity'}</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full sm:max-w-lg lg:max-w-xl mx-auto">
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
        <input
          type="date"
          className="border p-3 rounded-lg"
          id="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Location"
          className="border p-3 rounded-lg"
          id="location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">
          {volunteerOpportunity && !formData.imageFile ? 'Existing Image' : 'Upload Image'}
        </label>
        <input
          type="file"
          id="imageFile"
          accept="image/*"
          className="border p-3 rounded-lg"
          onChange={handleImageChange}
        />
        <button
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          disabled={loading}
        >
          {loading ? 'Submitting...' : volunteerOpportunity ? 'Update Volunteer Opportunity' : 'Add Volunteer Opportunity'}
        </button>
      </form>
      {error && (
        <div className="text-red-500 mt-3">
          <p>Error: {error}</p>
        </div>
      )}
      <div className="flex gap-2 mt-5">
        <p>Back to Volunteer Opportunities?</p>
        <button onClick={onClose} className="text-blue-700">Go to Volunteer Opportunities</button>
      </div>
    </div>
  );
}

VolunteerForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  volunteerOpportunity: PropTypes.object,
};
