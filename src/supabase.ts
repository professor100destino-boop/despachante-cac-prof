import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Export types for database tables
export type User = {
  id: string
  email: string
  full_name?: string
  company_name?: string
  phone?: string
  avatar_url?: string
  subscription_plan: 'free' | 'pro' | 'enterprise'
  subscription_status: 'active' | 'inactive' | 'paused'
  settings?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type Client = {
  id: string
  owner_id: string
  cpf: string
  rg?: string
  full_name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  notes?: string
  created_at: string
  updated_at: string
}

export type Process = {
  id: string
  client_id: string
  process_type: 'CAC' | 'PORTE' | 'POSSE' | 'COMPRA' | 'RENOVACAO'
  category?: 'ATIRADOR' | 'COLECIONADOR' | 'CACADOR'
  status: 'rascunho' | 'enviado' | 'em_analise' | 'aprovado' | 'indeferido'
  priority: 'low' | 'normal' | 'high'
  description?: string
  deadline_at?: string
  completed_at?: string
  notes?: string
  created_at: string
  updated_at: string
}

export type Weapon = {
  id: string
  client_id: string
  serial_number: string
  caliber?: string
  model?: string
  manufacturer?: string
  category?: string
  registration_number?: string
  registration_date?: string
  expiration_date?: string
  traffic_guide_status?: 'ativa' | 'expirada' | 'pendente'
  traffic_guide_expiration?: string
  last_inspection?: string
  notes?: string
  created_at: string
  updated_at: string
}

export type Document = {
  id: string
  owner_id: string
  client_id?: string
  process_id?: string
  weapon_id?: string
  file_name: string
  file_type?: string
  file_size?: number
  storage_path: string
  description?: string
  tags?: string[]
  version: number
  uploaded_at: string
  created_at: string
}

export type Deadline = {
  id: string
  owner_id: string
  client_id?: string
  process_id?: string
  weapon_id?: string
  title: string
  description?: string
  deadline_date: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  reminder_days?: number[]
  completed: boolean
  completed_at?: string
  created_at: string
  updated_at: string
}

export type KnowledgeBaseArticle = {
  id: string
  title: string
  content: string
  category?: string
  subcategory?: string
  tags?: string[]
  author?: string
  published: boolean
  created_at: string
  updated_at: string
}

export type Checklist = {
  id: string
  owner_id: string
  process_type: string
  category?: string
  title: string
  description?: string
  items: ChecklistItem[]
  created_at: string
  updated_at: string
  is_template: boolean
}

export type ChecklistItem = {
  id: string
  text: string
  description?: string
  required: boolean
  category?: string
}

export type ChecklistInstance = {
  id: string
  checklist_id: string
  process_id: string
  completed_items: string[]
  progress_percentage: number
  completed_at?: string
  created_at: string
  updated_at: string
}
