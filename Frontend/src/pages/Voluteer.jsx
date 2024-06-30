import React, { useEffect, useState } from 'react';
import VolunteerForm from '../components/VolunteerForm';
import VolunteerCard  from '../components/VolunteerCard';

export default function Volunteers() {
  const [volunteerOpportunities, setVolunteerOpportunities] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchVolunteerData = async () => {
      try {
        const res = await fetch('/api/v1/voluteers');
        const data = await res.json();
        if (!data.success) {
          console.error('Failed to fetch volunteer opportunities:', data.message);
          return;
        }
        setVolunteerOpportunities(data.data || []);
      } catch (error) {
        console.error('Error fetching volunteer opportunities:', error.message);
      }
    };

    fetchVolunteerData();
  }, []);

  const handleAddVolunteerOpportunity = (opportunity) => {
    setVolunteerOpportunities((prevOpportunities) => [...prevOpportunities, opportunity]);
  };

  const handleFormSubmit = (opportunity) => {
    handleAddVolunteerOpportunity(opportunity);
    setIsFormOpen(false);
  };

  return (
    <div className="p-5 flex flex-col items-center relative">
      <div className="flex justify-center items-center mb-5 w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-center text-gray-800">Volunteer Opportunities</h1>
      </div>

      {isFormOpen ? (
        <VolunteerForm onSubmit={handleFormSubmit} onClose={() => setIsFormOpen(false)} />
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl">
          {volunteerOpportunities.map((opportunity, index) => (
            <VolunteerCard key={index} opportunity={opportunity} />
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
