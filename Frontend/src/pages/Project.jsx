import React, { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import ProjectFormPage from '../components/ProjectForm';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('community');
  const [userRole, setUserRole] = useState('');
  const [projectToUpdate, setProjectToUpdate] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch('/api/v1/user');
        const data = await res.json();
        setUserRole(data.role);
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    const fetchCommunityProjects = async () => {
      try {
        const res = await fetch('/api/v1/projects');
        const data = await res.json();
        if (!data.success) {
          console.error('Failed to fetch project data:', data.message);
          return;
        }
        setProjects(data.data || []);
      } catch (error) {
        console.error('Error fetching project data:', error.message);
      }
    };

    const fetchMyProjects = async () => {
      try {
        const res = await fetch('/api/v1/projectsbyuser');
        const data = await res.json();
        if (!data.success) {
          console.error('Failed to fetch my project data:', data.message);
          return;
        }
        setMyProjects(data.data || []);
      } catch (error) {
        console.error('Error fetching my project data:', error.message);
      }
    };

    fetchUserRole();
    if (selectedTab === 'community') {
      fetchCommunityProjects();
    } else if (selectedTab === 'my') {
      fetchMyProjects();
    }
  }, [selectedTab]);

  const handleAddProject = (project) => {
    if (selectedTab === 'community') {
      setProjects((prevProjects) => [...prevProjects, project]);
    } else if (selectedTab === 'my') {
      setMyProjects((prevProjects) => [...prevProjects, project]);
    }
  };

  const handleUpdateProject = async (project) => {
    try {
      const res = await fetch(`/api/v1/projects/${project._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });
      const data = await res.json();
      if (!data.success) {
        console.error('Failed to update project:', data.message);
        return;
      }
      setMyProjects((prevProjects) =>
        prevProjects.map((p) => (p._id === project._id ? project : p))
      );
    } catch (error) {
      console.error('Error updating project:', error.message);
    }
  };

  const handleFormSubmit = async (project) => {
    if (projectToUpdate) {
      await handleUpdateProject(project);
    } else {
      handleAddProject(project);
    }
    setIsFormOpen(false);
    setProjectToUpdate(null);
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const res = await fetch(`/api/v1/projects/${projectId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) {
        console.error('Failed to delete project:', data.message);
        return;
      }
      setMyProjects((prevProjects) => prevProjects.filter((project) => project._id !== projectId));
      alert('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error.message);
    }
  };

  const handleUpdateButtonClick = (project) => {
    setProjectToUpdate(project);
    setIsFormOpen(true);
  };

  return (
    <div className="p-5 flex flex-col items-center relative">
      <div className="flex justify-center items-center mb-5 w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-center text-gray-800">Projects</h1>
      </div>

      <div className="flex justify-center items-center mb-5 w-full max-w-6xl space-x-4">
        <button
          className={`px-4 py-2 rounded ${selectedTab === 'community' ? 'bg-slate-700 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedTab('community')}
        >
          Community Projects
        </button>
        {( userRole === 'community organization' || userRole === 'community business') && (
          <button
            className={`px-4 py-2 rounded ${selectedTab === 'my' ? 'bg-slate-700 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedTab('my')}
          >
            My Projects
          </button>
        )}
      </div>

      {isFormOpen ? (
        <ProjectFormPage onSubmit={handleFormSubmit} onClose={() => setIsFormOpen(false)} project={projectToUpdate} />
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl">
          {selectedTab === 'community' && projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
          {selectedTab === 'my' && myProjects.map((project, index) => (
            <ProjectCard
              key={index}
              project={project}
              onDelete={handleDeleteProject}
              onUpdate={handleUpdateButtonClick}
              showDeleteButton={true}
            />
          ))}
        </div>
      )}
     {( userRole === 'community organization' || userRole === 'community business') && (
      <button
        className="bg-slate-700 text-white p-2 rounded-full hover:bg-slate-600 text-2xl flex items-center justify-center w-10 h-10 fixed bottom-15 right-10"
        onClick={() => setIsFormOpen(true)}
      >
        {'+'}
      </button>
     )}
    </div>
  );
}
