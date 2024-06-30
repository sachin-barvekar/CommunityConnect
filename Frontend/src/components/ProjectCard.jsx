import React from 'react';

export default function ProjectCard({ project }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white shadow-md rounded-lg">
      {project.image && (
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-60 object-cover rounded-t-lg"
        />
      )}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className="text-gray-700 mb-1"><strong>Organizer:</strong> {project.organizer.name}</p>
        <p className="text-gray-700 mb-1"><strong>Start Date:</strong> {formatDate(project.startDate)}</p>
        {project.endDate && (
          <p className="text-gray-700 mb-1"><strong>End Date:</strong> {formatDate(project.endDate)}</p>
        )}
        <p className="text-gray-700 mb-1"><strong>Status:</strong> {project.status}</p>
        <p className="text-gray-700 line-clamp-3">{project.description}</p>
      </div>
    </div>
  );
}
