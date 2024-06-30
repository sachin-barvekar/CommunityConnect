import React, { useEffect, useState } from 'react';
import EventCard from '../components/EventCard';
import EventFormPage from '../components/EventForm';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('community');
  const [eventToUpdate, setEventToUpdate] = useState(null);

  useEffect(() => {
    const fetchCommunityEvents = async () => {
      try {
        const res = await fetch('/api/v1/events');
        const data = await res.json();
        if (!data.success) {
          console.error('Failed to fetch event data:', data.message);
          return;
        }
        setEvents(data.data || []);
      } catch (error) {
        console.error('Error fetching event data:', error.message);
      }
    };

    const fetchMyEvents = async () => {
      try {
        const res = await fetch('/api/v1/eventsbyuser');
        const data = await res.json();
        if (!data.success) {
          console.error('Failed to fetch my event data:', data.message);
          return;
        }
        setMyEvents(data.data || []);
      } catch (error) {
        console.error('Error fetching my event data:', error.message);
      }
    };

    if (selectedTab === 'community') {
      fetchCommunityEvents();
    } else if (selectedTab === 'my') {
      fetchMyEvents();
    }
  }, [selectedTab]);

  const handleAddEvent = (event) => {
    if (selectedTab === 'community') {
      setEvents((prevEvents) => [...prevEvents, event]);
    } else if (selectedTab === 'my') {
      setMyEvents((prevEvents) => [...prevEvents, event]);
    }
  };

  const handleUpdateEvent = async (event) => {
    try {
      const res = await fetch(`/api/v1/events/${event._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
      const data = await res.json();
      if (!data.success) {
        console.error('Failed to update event:', data.message);
        return;
      }
      setMyEvents((prevEvents) =>
        prevEvents.map((e) => (e._id === event._id ? event : e))
      );
    } catch (error) {
      console.error('Error updating event:', error.message);
    }
  };

  const handleFormSubmit = async (event) => {
    if (eventToUpdate) {
      await handleUpdateEvent(event);
    } else {
      handleAddEvent(event);
    }
    setIsFormOpen(false);
    setEventToUpdate(null);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const res = await fetch(`/api/v1/events/${eventId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) {
        console.error('Failed to delete event:', data.message);
        return;
      }
      setMyEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
      alert('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error.message);
    }
  };

  const handleUpdateButtonClick = (event) => {
    setEventToUpdate(event);
    setIsFormOpen(true);
  };

  return (
    <div className="p-5 flex flex-col items-center relative">
      <div className="flex justify-center items-center mb-5 w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-center text-gray-800">Events</h1>
      </div>

      <div className="flex justify-center items-center mb-5 w-full max-w-6xl space-x-4">
        <button
          className={`px-4 py-2 rounded ${selectedTab === 'community' ? 'bg-slate-700 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedTab('community')}
        >
          Community Events
        </button>
        <button
          className={`px-4 py-2 rounded ${selectedTab === 'my' ? 'bg-slate-700 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedTab('my')}
        >
          My Events
        </button>
      </div>

      {isFormOpen ? (
        <EventFormPage onSubmit={handleFormSubmit} onClose={() => setIsFormOpen(false)} event={eventToUpdate} />
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl">
          {selectedTab === 'community' && events.map((event, index) => (
            <EventCard key={index} event={event} showDeleteButton={false} />
          ))}
          {selectedTab === 'my' && myEvents.map((event, index) => (
            <EventCard
              key={index}
              event={event}
              onDelete={handleDeleteEvent}
              onUpdate={handleUpdateButtonClick}
              showDeleteButton={true}
            />
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
