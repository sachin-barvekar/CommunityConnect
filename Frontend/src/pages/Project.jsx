import React, { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import ProjectFormPage from '../components/ProjectForm';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const res = await fetch('/api/v1/projects');
        const data = await res.json();
        console.log(data);
        if (!data.success) {
          console.error('Failed to fetch project data:', data.message);
          return;
        }
        setProjects(data.data || []);
      } catch (error) {
        console.error('Error fetching project data:', error.message);
      }
    };

    fetchProjectData();
  }, []);

  const handleAddProject = (project) => {
    setProjects((prevProjects) => [...prevProjects, project]);
  };

  const handleFormSubmit = (project) => {
    handleAddProject(project);
    setIsFormOpen(false);
  };

  return (
    <div className="p-5 flex flex-col items-center relative">
      <div className="flex justify-center items-center mb-5 w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-center text-gray-800">Community Projects</h1>
      </div>

      {isFormOpen ? (
        <ProjectFormPage onSubmit={handleFormSubmit} onClose={() => setIsFormOpen(false)} />
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      )}

      <button
        className="bg-slate-700 text-white p-2 rounded-full hover:bg-slate-600 text-2xl flex items-center justify-center w-10 h-10 fixed bottom-15 right-10"
        onClick={() => setIsFormOpen(true)}
      >
        {'+'}
      </button>
    </div>
  );
}
