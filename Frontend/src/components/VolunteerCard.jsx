import React from 'react';

export default function VolunteerCard ({ opportunity }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white shadow-md rounded-lg">
      {opportunity.image && (
        <img
          src={opportunity.image}
          alt={opportunity.title}
          className="w-full h-60 object-cover rounded-t-lg"
        />
      )}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{opportunity.title}</h3>
        <p className="text-gray-700 mb-1"><strong>Organization:</strong> {opportunity.organization.name}</p>
        <p className="text-gray-700 mb-1"><strong>Date:</strong> {formatDate(opportunity.date)}</p>
        <p className="text-gray-700 mb-1"><strong>Location:</strong> {opportunity.location}</p>
        <p className="text-gray-700 line-clamp-3">{opportunity.description}</p>
      </div>
    </div>
  );
}
