import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function NewsFormPage({ onSubmit, onClose, news }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageFile: null,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title || '',
        content: news.content || '',
        imageFile: news.image || null, // Assuming news.image contains the image URL
      });
    }
  }, [news]);

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
      formDataWithFile.append('content', formData.content);
      if (formData.imageFile instanceof File) {
        formDataWithFile.append('image', formData.imageFile);
      }

      const response = await fetch(news ? `/api/v1/news/${news._id}` : '/api/v1/news', {
        method: news ? 'PUT' : 'POST',
        body: formDataWithFile,
      });

      if (!response.ok) {
        throw new Error('Failed to submit news');
      }

      const data = await response.json();
      onSubmit(data.news);
      onClose();
      alert(news ? 'News updated successfully' : 'News created successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error submitting news:', error.message);
      setError('Failed to submit news. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-0 flex flex-col items-center">
      <div className="flex justify-center items-center mb-2 w-full max-w-lg mx-auto">
        <h1 className="text-3xl text-center font-semibold my-7">{news ? 'Update News' : 'Add News'}</h1>
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
          placeholder="Content"
          className="border p-3 rounded-lg"
          id="content"
          value={formData.content}
          onChange={handleChange}
          required
        />
        <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">
          {news && !formData.imageFile ? 'Existing Image' : 'Upload Image'}
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
          {loading ? 'Submitting...' : news ? 'Update News' : 'Add News'}
        </button>
      </form>
      {error && (
        <div className="text-red-500 mt-3">
          <p>Error: {error}</p>
        </div>
      )}
      <div className="flex gap-2 mt-5">
        <p>Back to News?</p>
        <button onClick={onClose} className="text-blue-700">Go to News</button>
      </div>
    </div>
  );
}

NewsFormPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  news: PropTypes.object,
};
