import React from 'react';

export default function NewsCard({ news, onDelete, onUpdate, showDeleteButton }) {
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white shadow-md rounded-lg">
      {news.image && (
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-60 object-cover rounded-t-lg"
        />
      )}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{news.title}</h3>
        <p className="text-gray-700 mb-1"><strong>Author:</strong> {news.author.name}</p>
        <p className="text-gray-700 mb-1"><strong>Date:</strong> {formatDate(news.createdAt)}</p>
        <p className="text-gray-700 line-clamp-3">{news.content}</p>
        {showDeleteButton && (
          <div className="mt-4 flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-400"
              onClick={() => onDelete(news._id)}
            >
              Delete
            </button>
            <button
              className="bg-slate-600 text-white px-3 py-1 rounded"
              onClick={() => onUpdate(news)}
            >
              Update
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
