import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

export default function NewsCard({ news, onDelete, onUpdate, showDeleteButton }) {
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white shadow-md rounded-lg relative">
      {news.image && (
        <div className="relative">
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-60 object-cover rounded-t-lg"
          />
          {showDeleteButton && (
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-400 flex items-center justify-center"
                onClick={() => onDelete(news._id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button
                className="p-2 bg-slate-600 text-white rounded-full flex hover:bg-slate-500 items-center justify-center"
                onClick={() => onUpdate(news)}
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </div>
          )}
        </div>
      )}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{news.title}</h3>
        <p className="text-gray-700 mb-1"><strong>Publisher:</strong> {news.author.name}</p>
        <p className="text-gray-700 mb-1"><strong>Date:</strong> {formatDate(news.createdAt)}</p>
        <p className="text-gray-700 line-clamp-3">{news.content}</p>
      </div>
    </div>
  );
}
