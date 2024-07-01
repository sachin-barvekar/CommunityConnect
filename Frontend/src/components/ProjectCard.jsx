import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

export default function ProjectCard({ project, onDelete, onUpdate, showDeleteButton }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white shadow-md rounded-lg relative">
      {project.image && (
        <div className="relative">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-60 object-cover rounded-t-lg"
          />
          {showDeleteButton && (
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-400 flex items-center justify-center"
                onClick={() => onDelete(project._id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button
                className="p-2 bg-slate-600 text-white rounded-full hover:bg-slate-500 flex items-center justify-center"
                onClick={() => onUpdate(project)}
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </div>
          )}
        </div>
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