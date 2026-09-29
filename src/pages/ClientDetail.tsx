import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, FileText, User as UserIcon } from 'lucide-react'
import { supabase, type Client, type Process } from '../supabase'
import { Button, Card, CardHeader, CardBody, Modal, Select, TextArea } from '../components'

const PROCESS_TYPES = [
  { value: 'CAC', label: 'CAC' },
  { value: 'PORTE', label: 'Porte' },
  { value: 'POSSE', label: 'Posse' },
  { value: 'COMPRA', label: 'Compra' },
  { value: 'RENOVACAO', label: 'Renovação' },
]

const CATEGORIES = [
  { value: 'ATIRADOR', label: 'Atirador' },
  { value: 'COLECIONADOR', label: 'Colecionador' },
  { value: 'CACADOR', label: 'Caçador' },
]

export const ClientDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [client, setClient] = useState<Client | null>(null)
  const [processes, setProcesses] = useState<Process[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    process_type: 'CAC',
    category: '',
    priority: 'normal',
    description: '',
  })

  useEffect(() => {
    if (id) fetchData(id)
  }, [id])

  const fetchData = async (clientId: string) => {
    setLoading(true)
    try {
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single()

      if (clientError || !clientData) {
        setNotFound(true)
        return
      }
      setClient(clientData as Client)

      const { data: processesData } = await supabase
        .from('processes')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })

      setProcesses((processesData as Process[]) || [])
    } catch (err) {
      console.error('Erro ao buscar cliente:', err)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProcess = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    setError(null)
    setSaving(true)
    try {
      const { error: insertError } = await supabase.from('processes').insert([
        {
          client_id: id,
          process_type: form.process_type,
          category: form.category || null,
          priority: form.priority,
          description: form.description.trim() || null,
        },
      ])

      if (insertError) throw insertError

      setModalOpen(false)
      setForm({ process_type: 'CAC', category: '', priority: 'normal', description: '' })
      fetchData(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar processo.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (notFound || !client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-700 mb-4">Cliente não encontrado.</p>
          <Button variant="primary" onClick={() => navigate('/dashboard')}>
            Voltar ao painel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3"
          >
            <ArrowLeft size={18} />
            Voltar ao painel
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-full p-3">
              <UserIcon className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{client.full_name}</h1>
              <p className="text-gray-600">CPF: {client.cpf}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Card>
          <CardHeader title="Dados do Cliente" />
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">RG</p>
                <p className="text-gray-900 font-medium">{client.rg || '-'}</p>
              </div>
              <div>
                <p className="text-gray-500">E-mail</p>
                <p className="text-gray-900 font-medium">{client.email || '-'}</p>
              </div>
              <div>
                <p className="text-gray-500">Telefone</p>
                <p className="text-gray-900 font-medium">{client.phone || '-'}</p>
              </div>
              <div>
                <p className="text-gray-500">Cidade/UF</p>
                <p className="text-gray-900 font-medium">
                  {client.city ? `${client.city}${client.state ? '/' + client.state : ''}` : '-'}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-500">Endereço</p>
                <p className="text-gray-900 font-medium">{client.address || '-'}</p>
              </div>
              {client.notes && (
                <div className="md:col-span-2">
                  <p className="text-gray-500">Observações</p>
                  <p className="text-gray-900 font-medium">{client.notes}</p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Processos"
            action={
              <Button variant="primary" size="sm" icon={<Plus size={16} />} onClick={() => setModalOpen(true)}>
                Novo Processo
              </Button>
            }
          />
          <CardBody>
            {processes.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto text-gray-400 mb-3" size={32} />
                <p className="text-gray-600">Nenhum processo cadastrado para este cliente ainda.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {processes.map((process) => (
                  <div
                    key={process.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {process.process_type}
                        {process.category ? ` - ${process.category}` : ''}
                      </p>
                      {process.description && (
                        <p className="text-sm text-gray-600 mt-1">{process.description}</p>
                      )}
                    </div>
                    <span className="text-sm font-medium capitalize text-gray-700 bg-white border border-gray-200 rounded-full px-3 py-1">
                      {process.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </main>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Novo Processo"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" isLoading={saving} onClick={handleCreateProcess}>
              Criar Processo
            </Button>
          </>
        }
      >
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <Select
            label="Tipo de Processo"
            value={form.process_type}
            onChange={(e) => setForm((p) => ({ ...p, process_type: e.target.value }))}
            options={PROCESS_TYPES}
          />
          <Select
            label="Categoria (se aplicável)"
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            options={CATEGORIES}
          />
          <TextArea
            label="Descrição"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            rows={3}
            placeholder="Detalhes do processo"
          />
        </div>
      </Modal>
    </div>
  )
}
