import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { useAuthStore } from '../store/auth'
import { supabase } from '../supabase'
import { Button, Card, CardHeader, CardBody, Input, TextArea, Select } from '../components'

const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
].map((uf) => ({ value: uf, label: uf }))

export const ClientForm = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [form, setForm] = useState({
    full_name: '',
    cpf: '',
    rg: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    notes: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.full_name.trim() || !form.cpf.trim()) {
      setError('Nome completo e CPF são obrigatórios.')
      return
    }

    if (!user) {
      setError('Sessão expirada. Faça login novamente.')
      return
    }

    setSaving(true)
    try {
      const { data, error: insertError } = await supabase
        .from('clients')
        .insert([
          {
            owner_id: user.id,
            full_name: form.full_name.trim(),
            cpf: form.cpf.trim(),
            rg: form.rg.trim() || null,
            email: form.email.trim() || null,
            phone: form.phone.trim() || null,
            address: form.address.trim() || null,
            city: form.city.trim() || null,
            state: form.state || null,
            notes: form.notes.trim() || null,
          },
        ])
        .select()
        .single()

      if (insertError) {
        if (insertError.code === '23505') {
          throw new Error('Já existe um cliente cadastrado com esse CPF.')
        }
        throw insertError
      }

      navigate(`/clients/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar cliente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-card">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3"
          >
            <ArrowLeft size={18} />
            Voltar ao painel
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Novo Cliente</h1>
          <p className="text-gray-600 mt-1">Cadastre os dados do cliente para iniciar um processo.</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader title="Dados do Cliente" />
          <CardBody>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nome completo *"
                value={form.full_name}
                onChange={handleChange('full_name')}
                placeholder="Nome completo do cliente"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="CPF *"
                  value={form.cpf}
                  onChange={handleChange('cpf')}
                  placeholder="000.000.000-00"
                  required
                />
                <Input
                  label="RG"
                  value={form.rg}
                  onChange={handleChange('rg')}
                  placeholder="Número do RG"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="E-mail"
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  placeholder="email@exemplo.com"
                />
                <Input
                  label="Telefone"
                  value={form.phone}
                  onChange={handleChange('phone')}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <Input
                label="Endereço"
                value={form.address}
                onChange={handleChange('address')}
                placeholder="Rua, número, bairro"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Cidade"
                  value={form.city}
                  onChange={handleChange('city')}
                  placeholder="Cidade"
                />
                <Select
                  label="Estado"
                  value={form.state}
                  onChange={handleChange('state')}
                  options={ESTADOS}
                />
              </div>

              <TextArea
                label="Observações"
                value={form.notes}
                onChange={handleChange('notes')}
                placeholder="Informações adicionais sobre o cliente"
                rows={4}
              />

              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="primary" icon={<Save size={18} />} isLoading={saving}>
                  Salvar Cliente
                </Button>
                <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </main>
    </div>
  )
}
