import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import { Button, Input, Alert, Card } from '../components'
import { LogIn, Mail, Lock } from 'lucide-react'

export const Login = () => {
  const navigate = useNavigate()
  const { signIn, error, loading, clearError } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [formError, setFormError] = useState('')
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    clearError()

    try {
      if (isSignUp) {
        if (!fullName || !companyName) {
          setFormError('Por favor, preencha todos os campos')
          return
        }
        await useAuthStore.getState().signUp(email, password, fullName, companyName)
      } else {
        await signIn(email, password)
      }
      navigate('/dashboard')
    } catch (err) {
      // Error is already set in store
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 text-white rounded-lg p-3">
              <LogIn size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">DESPACHANTE CAC PROF</h1>
          <p className="text-gray-600 mt-2">Sistema especializado em despachantia para CAC</p>
        </div>

        {/* Errors */}
        {(error || formError) && (
          <Alert
            type="error"
            title="Erro"
            message={error || formError}
            onClose={clearError}
          />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <Input
                label="Nome Completo"
                placeholder="João Silva"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="Nome da Empresa"
                placeholder="Despachante CAC Silva"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </>
          )}

          <Input
            label="E-mail"
            placeholder="seu@email.com"
            type="email"
            icon={<Mail size={18} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Senha"
            placeholder="••••••••"
            type="password"
            icon={<Lock size={18} />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            fullWidth
            isLoading={loading}
            className="mt-6"
          >
            {isSignUp ? 'Criar Conta' : 'Entrar'}
          </Button>
        </form>

        {/* Toggle */}
        <div className="mt-6 text-center border-t border-gray-200 pt-6">
          <p className="text-gray-600 text-sm mb-3">
            {isSignUp ? 'Já possui uma conta?' : 'Não possui uma conta?'}
          </p>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setFormError('')
              clearError()
            }}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            {isSignUp ? 'Fazer Login' : 'Criar Nova Conta'}
          </button>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Demo:</strong> Use qualquer email e senha para testar. Seus dados serão armazenados com segurança no Supabase.
          </p>
        </div>
      </Card>
    </div>
  )
}
