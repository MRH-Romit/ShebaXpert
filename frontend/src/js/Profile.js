import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = ({ isEditing = false }) => {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState({
    address: '',
    latitude: '',
    longitude: '',
    serviceCategory: '',
    description: '',
    availability: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/profile/${user.id}`);
        setProfile(response.data.profile || {});
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(profile);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Profile' : 'Profile'}</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={profile.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="latitude" className="block text-gray-700">Latitude</label>
            <input
              type="text"
              id="latitude"
              name="latitude"
              value={profile.latitude}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="longitude" className="block text-gray-700">Longitude</label>
            <input
              type="text"
              id="longitude"
              name="longitude"
              value={profile.longitude}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="serviceCategory" className="block text-gray-700">Service Category</label>
            <input
              type="text"
              id="serviceCategory"
              name="serviceCategory"
              value={profile.serviceCategory}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={profile.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="availability" className="block text-gray-700">Availability</label>
            <input
              type="text"
              id="availability"
              name="availability"
              value={profile.availability}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      ) : (
        <div>
          <p><strong>Address:</strong> {profile.address || 'N/A'}</p>
          <p><strong>Latitude:</strong> {profile.latitude || 'N/A'}</p>
          <p><strong>Longitude:</strong> {profile.longitude || 'N/A'}</p>
          <p><strong>Service Category:</strong> {profile.serviceCategory || 'N/A'}</p>
          <p><strong>Description:</strong> {profile.description || 'N/A'}</p>
          <p><strong>Availability:</strong> {profile.availability || 'N/A'}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
