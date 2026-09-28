import { create } from 'zustand'
import { supabase, type User } from '../supabase'

interface AuthStore {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean

  // Auth methods
  signUp: (email: string, password: string, fullName: string, companyName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,

  signUp: async (email, password, fullName, companyName) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      // Create user profile in users table
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email,
              full_name: fullName,
              company_name: companyName,
              subscription_plan: 'free',
              subscription_status: 'active',
            },
          ])

        if (profileError) throw profileError
      }

      set({ isAuthenticated: true, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao criar conta',
        loading: false,
      })
      throw error
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Fetch user profile
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (profileError) throw profileError

        set({
          user: profile as User,
          isAuthenticated: true,
          loading: false,
        })
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao entrar',
        loading: false,
      })
      throw error
    }
  },

  signOut: async () => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao sair',
        loading: false,
      })
      throw error
    }
  },

  resetPassword: async (email) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error
      set({ loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao resetar senha',
        loading: false,
      })
      throw error
    }
  },

  updateProfile: async (updates) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', get().user?.id)
        .select()
        .single()

      if (error) throw error

      set({ user: data as User, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao atualizar perfil',
        loading: false,
      })
      throw error
    }
  },

  checkAuth: async () => {
    set({ loading: true })
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) throw error

      if (session?.user) {
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profileError) throw profileError

        set({
          user: profile as User,
          isAuthenticated: true,
          loading: false,
        })
      } else {
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
        })
      }
    } catch (error) {
      console.error('Auth check error:', error)
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      })
    }
  },

  clearError: () => set({ error: null }),
}))
