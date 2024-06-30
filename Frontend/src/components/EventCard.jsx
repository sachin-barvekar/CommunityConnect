import React from 'react';

export default function EventCard({ event, onDelete, onUpdate, showDeleteButton }) {
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white shadow-md rounded-lg">
      {event.image && (
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-60 object-cover rounded-t-lg"
        />
      )}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
        <p className="text-gray-700 mb-1"><strong>Organizer:</strong> {event.organizer.name}</p>
        <p className="text-gray-700 mb-1"><strong>Date:</strong> {formatDate(event.date)}</p>
        <p className="text-gray-700 mb-1"><strong>Location:</strong> {event.location}</p>
        <p className="text-gray-700 line-clamp-3">{event.description}</p>
        {showDeleteButton && (
          <div className="mt-4 flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-400"
              onClick={() => onDelete(event._id)}
            >
              Delete
            </button>
            <button
              className="bg-slate-600 text-white px-3 py-1 rounded"
              onClick={() => onUpdate(event)}
            >
              Update
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
