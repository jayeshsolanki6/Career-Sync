import { createContext, useContext, useState, useEffect } from 'react';
import { profileAPI } from '../services/api';
import { useAuth } from './AuthContext';

const ProfileContext = createContext(null);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile must be used within ProfileProvider');
  return context;
};

export const ProfileProvider = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await profileAPI.getProfile();
      setProfile(res.data.data);
    } catch (error) {
      console.error('Failed to fetch profile', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const uploadProfile = async (formData) => {
    const res = await profileAPI.uploadProfile(formData);
    setProfile(res.data.data);
    return res.data.data;
  };

  const updateProfile = async (data) => {
    const res = await profileAPI.updateProfile(data);
    setProfile(res.data.data);
    return res.data.data;
  };

  return (
    <ProfileContext.Provider value={{ profile, loading, fetchProfile, uploadProfile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
