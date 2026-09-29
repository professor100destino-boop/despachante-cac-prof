import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/auth'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { ClientForm } from './pages/ClientForm'
import { ClientDetail } from './pages/ClientDetail'
import './index.css'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

function App() {
  const { checkAuth, loading } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
          </div>
          <p className="text-gray-600">Carregando DESPACHANTE CAC PROF...</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter basename="/despachante-cac-prof">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/new"
          element={
            <ProtectedRoute>
              <ClientForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/:id"
          element={
            <ProtectedRoute>
              <ClientDetail />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
