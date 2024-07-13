import React, { useEffect, useState } from 'react';
import VolunteerForm from '../components/VolunteerForm';
import VolunteerCard from '../components/VolunteerCard';

export default function Volunteers() {
  const [volunteerOpportunities, setVolunteerOpportunities] = useState([]);
  const [myVolunteerOpportunities, setMyVolunteerOpportunities] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('community');
  const [userRole, setUserRole] = useState('');
  const [volunteerToUpdate, setVolunteerToUpdate] = useState(null);

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

    const fetchCommunityVolunteers = async () => {
      try {
        const res = await fetch('/api/v1/volunteers');
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

    const fetchMyVolunteers = async () => {
      try {
        const res = await fetch('/api/v1/volunteersbyuser');
        const data = await res.json();
        if (!data.success) {
          console.error('Failed to fetch my volunteer opportunities:', data.message);
          return;
        }
        setMyVolunteerOpportunities(data.data || []);
      } catch (error) {
        console.error('Error fetching my volunteer opportunities:', error.message);
      }
    };

    fetchUserRole();
    if (selectedTab === 'community') {
      fetchCommunityVolunteers();
    } else if (selectedTab === 'my') {
      fetchMyVolunteers();
    }
  }, [selectedTab]);

  const handleAddVolunteerOpportunity = (opportunity) => {
    if (selectedTab === 'community') {
      setVolunteerOpportunities((prevOpportunities) => [...prevOpportunities, opportunity]);
    } else if (selectedTab === 'my') {
      setMyVolunteerOpportunities((prevOpportunities) => [...prevOpportunities, opportunity]);
    }
  };

  const handleUpdateVolunteerOpportunity = (opportunity) => {
    if (selectedTab === 'community') {
      setVolunteerOpportunities((prevOpportunities) =>
        prevOpportunities.map((o) => (o._id === opportunity._id ? opportunity : o))
      );
    } else if (selectedTab === 'my') {
      setMyVolunteerOpportunities((prevOpportunities) =>
        prevOpportunities.map((o) => (o._id === opportunity._id ? opportunity : o))
      );
    }
  };

  const handleFormSubmit = async (opportunity) => {
    if (volunteerToUpdate) {
      handleUpdateVolunteerOpportunity(opportunity);
    } else {
      handleAddVolunteerOpportunity(opportunity);
    }
    setIsFormOpen(false);
    setVolunteerToUpdate(null);
  };

  const handleDeleteVolunteerOpportunity = async (opportunityId) => {
    try {
      const res = await fetch(`/api/v1/volunteers/${opportunityId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) {
        console.error('Failed to delete volunteer opportunity:', data.message);
        return;
      }
      setMyVolunteerOpportunities((prevOpportunities) =>
        prevOpportunities.filter((opportunity) => opportunity._id !== opportunityId)
      );
      alert('Volunteer opportunity deleted successfully');
    } catch (error) {
      console.error('Error deleting volunteer opportunity:', error.message);
    }
  };

  const handleUpdateButtonClick = (opportunity) => {
    setVolunteerToUpdate(opportunity);
    setIsFormOpen(true);
  };

  return (
    <div className="p-5 flex flex-col items-center relative">
      <div className="flex justify-center items-center mb-5 w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-center text-gray-800">Volunteer Opportunities</h1>
      </div>

      <div className="flex justify-center items-center mb-5 w-full max-w-6xl space-x-4">
        <button
          className={`px-4 py-2 rounded ${selectedTab === 'community' ? 'bg-slate-700 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedTab('community')}
        >
          Community Volunteer Opportunities
        </button>
        {userRole === 'community organization' && (
          <button
            className={`px-4 py-2 rounded ${selectedTab === 'my' ? 'bg-slate-700 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedTab('my')}
          >
            My Volunteer Opportunities
          </button>
        )}
      </div>

      {isFormOpen ? (
        <VolunteerForm onSubmit={handleFormSubmit} onClose={() => setIsFormOpen(false)} volunteerOpportunity={volunteerToUpdate} />
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl">
          {selectedTab === 'community' && volunteerOpportunities.map((opportunity, index) => (
            <VolunteerCard key={index} opportunity={opportunity} />
          ))}
          {selectedTab === 'my' && myVolunteerOpportunities.map((opportunity, index) => (
            <VolunteerCard
              key={index}
              opportunity={opportunity}
              onDelete={handleDeleteVolunteerOpportunity}
              onUpdate={handleUpdateButtonClick}
              showDeleteButton={true}
            />
          ))}
        </div>
      )}
      {userRole === 'community organization' && (
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
