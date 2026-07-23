import { create } from 'zustand'
import { authAPI } from '../services/api'
import { useProfileStore } from './useProfileStore'

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  checkAuth: async () => {
    try {
      const res = await authAPI.checkAuth()
      set({ user: res.data, loading: false })
      if (res.data) {
        useProfileStore.getState().fetchProfile()
      } else {
        useProfileStore.getState().resetProfile()
      }
    } catch {
      set({ user: null, loading: false })
      useProfileStore.getState().resetProfile()
    }
  },

  login: async (credentials) => {
    const res = await authAPI.login(credentials)
    set({ user: res.data, loading: false })
    if (res.data) {
      useProfileStore.getState().fetchProfile()
    }
    return res.data
  },

  signup: async (data) => {
    const res = await authAPI.signup(data)
    set({ user: res.data, loading: false })
    if (res.data) {
      useProfileStore.getState().fetchProfile()
    }
    return res.data
  },

  logout: async () => {
    await authAPI.logout()
    set({ user: null, loading: false })
    useProfileStore.getState().resetProfile()
  },
}))
