import { create } from 'zustand'
import { profileAPI } from '../services/api'

export const useProfileStore = create((set) => ({
  profile: null,
  loading: true,

  fetchProfile: async () => {
    try {
      set({ loading: true })
      const res = await profileAPI.getProfile()
      set({ profile: res.data.data, loading: false })
    } catch (error) {
      console.error('Failed to fetch profile', error)
      set({ profile: null, loading: false })
    }
  },

  uploadProfile: async (formData) => {
    const res = await profileAPI.uploadProfile(formData)
    set({ profile: res.data.data })
    return res.data.data
  },

  updateProfile: async (data) => {
    const res = await profileAPI.updateProfile(data)
    set({ profile: res.data.data })
    return res.data.data
  },

  resetProfile: () => {
    set({ profile: null, loading: false })
  },
}))
