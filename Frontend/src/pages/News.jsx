import React, { useEffect, useState } from 'react';
import NewsCard from '../components/NewsCard';
import NewsForm from '../components/NewsForm';

export default function News() {
  const [news, setNews] = useState([]);
  const [myNews, setMyNews] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('community');
  const [newsToUpdate, setNewsToUpdate] = useState(null);

  useEffect(() => {
    const fetchCommunityNews = async () => {
      try {
        const res = await fetch('/api/v1/news');
        const data = await res.json();
        if (!data.success) {
          console.error('Failed to fetch news data:', data.message);
          return;
        }
        setNews(data.data || []);
      } catch (error) {
        console.error('Error fetching news data:', error.message);
      }
    };

    const fetchMyNews = async () => {
      try {
        const res = await fetch('/api/v1/newsbyuser');
        const data = await res.json();
        if (!data.success) {
          console.error('Failed to fetch my news data:', data.message);
          return;
        }
        setMyNews(data.data || []);
      } catch (error) {
        console.error('Error fetching my news data:', error.message);
      }
    };

    if (selectedTab === 'community') {
      fetchCommunityNews();
    } else if (selectedTab === 'my') {
      fetchMyNews();
    }
  }, [selectedTab]);

  const handleAddNews = (newsItem) => {
    if (selectedTab === 'community') {
      setNews((prevNews) => [...prevNews, newsItem]);
    } else if (selectedTab === 'my') {
      setMyNews((prevNews) => [...prevNews, newsItem]);
    }
  };

  const handleUpdateNews = async (newsItem) => {
    try {
      const res = await fetch(`/api/v1/news/${newsItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsItem),
      });
      const data = await res.json();
      if (!data.success) {
        console.error('Failed to update news item:', data.message);
        return;
      }
      setMyNews((prevNews) =>
        prevNews.map((n) => (n._id === newsItem._id ? newsItem : n))
      );
    } catch (error) {
      console.error('Error updating news item:', error.message);
    }
  };

  const handleFormSubmit = async (newsItem) => {
    if (newsToUpdate) {
      await handleUpdateNews(newsItem);
    } else {
      handleAddNews(newsItem);
    }
    setIsFormOpen(false);
    setNewsToUpdate(null);
  };

  const handleDeleteNews = async (newsId) => {
    try {
      const res = await fetch(`/api/v1/news/${newsId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) {
        console.error('Failed to delete news item:', data.message);
        return;
      }
      setMyNews((prevNews) => prevNews.filter((newsItem) => newsItem._id !== newsId));
      alert('News item deleted successfully');
    } catch (error) {
      console.error('Error deleting news item:', error.message);
    }
  };

  const handleUpdateButtonClick = (newsItem) => {
    setNewsToUpdate(newsItem);
    setIsFormOpen(true);
  };

  return (
    <div className="p-5 flex flex-col items-center relative">
      <div className="flex justify-center items-center mb-5 w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-center text-gray-800">News</h1>
      </div>

      <div className="flex justify-center items-center mb-5 w-full max-w-6xl space-x-4">
        <button
          className={`px-4 py-2 rounded ${selectedTab === 'community' ? 'bg-slate-700 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedTab('community')}
        >
          Community News
        </button>
        <button
          className={`px-4 py-2 rounded ${selectedTab === 'my' ? 'bg-slate-700 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedTab('my')}
        >
          My News
        </button>
      </div>

      {isFormOpen ? (
        <NewsForm onSubmit={handleFormSubmit} onClose={() => setIsFormOpen(false)} news={newsToUpdate} />
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl">
          {selectedTab === 'community' && news.map((newsItem, index) => (
            <NewsCard key={index} news={newsItem} showDeleteButton={false} />
          ))}
          {selectedTab === 'my' && myNews.map((newsItem, index) => (
            <NewsCard
              key={index}
              news={newsItem}
              onDelete={handleDeleteNews}
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