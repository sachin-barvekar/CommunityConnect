import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

export default function EventCard({ event, onDelete, onUpdate, showDeleteButton }) {
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white shadow-md rounded-lg relative">
      {event.image && (
        <div className="relative">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-60 object-cover rounded-t-lg"
          />
          {showDeleteButton && (
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-400 flex items-center justify-center"
                onClick={() => onDelete(event._id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button
                className="p-2 bg-slate-600 text-white rounded-full hover:bg-slate-500 flex items-center justify-center"
                onClick={() => onUpdate(event)}
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </div>
          )}
        </div>
      )}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
        <p className="text-gray-700 mb-1"><strong>Organizer:</strong> {event.organizer.name}</p>
        <p className="text-gray-700 mb-1"><strong>Date:</strong> {formatDate(event.date)}</p>
        <p className="text-gray-700 mb-1"><strong>Location:</strong> {event.location}</p>
        <p className="text-gray-700 line-clamp-3">{event.description}</p>
      </div>
    </div>
  );
}