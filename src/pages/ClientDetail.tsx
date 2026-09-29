import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, FileText, User as UserIcon, Crosshair, AlertTriangle } from 'lucide-react'
import { supabase, type Client, type Process, type Weapon } from '../supabase'
import { Button, Card, CardHeader, CardBody, Modal, Select, TextArea, Input } from '../components'

const PROCESS_TYPES = [
  { value: 'CAC', label: 'CAC' },
  { value: 'PORTE', label: 'Porte' },
  { value: 'POSSE', label: 'Posse' },
  { value: 'COMPRA', label: 'Aquisição/Compra' },
  { value: 'RENOVACAO', label: 'Renovação de CRAF' },
  { value: 'TRANSFERENCIA', label: 'Transferência de Propriedade' },
  { value: 'APOSTILAMENTO', label: 'Apostilamento' },
]

const PROCESS_STATUS = [
  { value: 'rascunho', label: 'Rascunho' },
  { value: 'enviado', label: 'Protocolado' },
  { value: 'em_analise', label: 'Em Análise' },
  { value: 'aprovado', label: 'Aprovado/Deferido' },
  { value: 'indeferido', label: 'Indeferido' },
]

const CATEGORIES = [
  { value: 'ATIRADOR', label: 'Atirador' },
  { value: 'COLECIONADOR', label: 'Colecionador' },
  { value: 'CACADOR', label: 'Caçador' },
]

const TRAFFIC_GUIDE_STATUS = [
  { value: 'ativa', label: 'Ativa' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'expirada', label: 'Expirada' },
]

// Days until a given ISO date; negative means already past.
const daysUntil = (dateStr?: string) => {
  if (!dateStr) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

const urgencyClasses = (days: number | null) => {
  if (days === null) return 'bg-white border-gray-200 text-gray-700'
  if (days < 0) return 'bg-red-50 border-red-300 text-red-700'
  if (days <= 30) return 'bg-yellow-50 border-yellow-300 text-yellow-800'
  return 'bg-green-50 border-green-200 text-green-700'
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

const DateBadge = ({ label, dateStr }: { label: string; dateStr?: string }) => {
  if (!dateStr) return null
  const days = daysUntil(dateStr)
  let statusText = ''
  if (days !== null) {
    if (days < 0) statusText = `vencido há ${Math.abs(days)} dia(s)`
    else if (days === 0) statusText = 'vence hoje'
    else statusText = `vence em ${days} dia(s)`
  }
  return (
    <span className={`text-xs font-medium border rounded-full px-3 py-1 ${urgencyClasses(days)}`}>
      {label}: {formatDate(dateStr)} {statusText && `· ${statusText}`}
    </span>
  )
}

export const ClientDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [client, setClient] = useState<Client | null>(null)
  const [processes, setProcesses] = useState<Process[]>([])
  const [weapons, setWeapons] = useState<Weapon[]>([])
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
    deadline_at: '',
  })
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null)

  const [weaponModalOpen, setWeaponModalOpen] = useState(false)
  const [savingWeapon, setSavingWeapon] = useState(false)
  const [weaponError, setWeaponError] = useState<string | null>(null)
  const [weaponForm, setWeaponForm] = useState({
    serial_number: '',
    caliber: '',
    model: '',
    manufacturer: '',
    category: '',
    registration_number: '',
    registration_date: '',
    expiration_date: '',
    traffic_guide_status: '',
    traffic_guide_expiration: '',
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

      const { data: weaponsData } = await supabase
        .from('weapons')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })

      setWeapons((weaponsData as Weapon[]) || [])
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
          deadline_at: form.deadline_at || null,
        },
      ])

      if (insertError) throw insertError

      setModalOpen(false)
      setForm({ process_type: 'CAC', category: '', priority: 'normal', description: '', deadline_at: '' })
      fetchData(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar processo.')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateProcessStatus = async (processId: string, status: string) => {
    if (!id) return
    setUpdatingStatusId(processId)
    try {
      const updates: Record<string, unknown> = { status }
      if (status === 'aprovado' || status === 'indeferido') {
        updates.completed_at = new Date().toISOString()
      }
      const { error: updateError } = await supabase.from('processes').update(updates).eq('id', processId)
      if (updateError) throw updateError
      setProcesses((prev) =>
        prev.map((p) => (p.id === processId ? { ...p, status: status as Process['status'] } : p))
      )
    } catch (err) {
      console.error('Erro ao atualizar status do processo:', err)
    } finally {
      setUpdatingStatusId(null)
    }
  }

  const handleCreateWeapon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    setWeaponError(null)

    if (!weaponForm.serial_number.trim()) {
      setWeaponError('O número de série é obrigatório.')
      return
    }

    setSavingWeapon(true)
    try {
      const { error: insertError } = await supabase.from('weapons').insert([
        {
          client_id: id,
          serial_number: weaponForm.serial_number.trim(),
          caliber: weaponForm.caliber.trim() || null,
          model: weaponForm.model.trim() || null,
          manufacturer: weaponForm.manufacturer.trim() || null,
          category: weaponForm.category || null,
          registration_number: weaponForm.registration_number.trim() || null,
          registration_date: weaponForm.registration_date || null,
          expiration_date: weaponForm.expiration_date || null,
          traffic_guide_status: weaponForm.traffic_guide_status || null,
          traffic_guide_expiration: weaponForm.traffic_guide_expiration || null,
        },
      ])

      if (insertError) {
        if (insertError.code === '23505') {
          throw new Error('Já existe uma arma cadastrada com esse número de série para este cliente.')
        }
        throw insertError
      }

      setWeaponModalOpen(false)
      setWeaponForm({
        serial_number: '',
        caliber: '',
        model: '',
        manufacturer: '',
        category: '',
        registration_number: '',
        registration_date: '',
        expiration_date: '',
        traffic_guide_status: '',
        traffic_guide_expiration: '',
      })
      fetchData(id)
    } catch (err) {
      setWeaponError(err instanceof Error ? err.message : 'Erro ao cadastrar arma.')
    } finally {
      setSavingWeapon(false)
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
                {processes.map((process) => {
                  const days = daysUntil(process.deadline_at)
                  return (
                    <div key={process.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            {PROCESS_TYPES.find((t) => t.value === process.process_type)?.label ||
                              process.process_type}
                            {process.category ? ` - ${process.category}` : ''}
                          </p>
                          {process.description && (
                            <p className="text-sm text-gray-600 mt-1">{process.description}</p>
                          )}
                        </div>
                        <select
                          className="input !w-auto text-sm py-1.5"
                          value={process.status}
                          disabled={updatingStatusId === process.id}
                          onChange={(e) => handleUpdateProcessStatus(process.id, e.target.value)}
                        >
                          {PROCESS_STATUS.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      {process.deadline_at && (
                        <div className="mt-3">
                          <DateBadge label="Prazo" dateStr={process.deadline_at} />
                        </div>
                      )}
                      {days !== null && days < 7 && days >= 0 && process.status !== 'aprovado' && (
                        <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                          <AlertTriangle size={14} /> Prazo próximo do vencimento.
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Armas"
            action={
              <Button variant="primary" size="sm" icon={<Plus size={16} />} onClick={() => setWeaponModalOpen(true)}>
                Nova Arma
              </Button>
            }
          />
          <CardBody>
            {weapons.length === 0 ? (
              <div className="text-center py-8">
                <Crosshair className="mx-auto text-gray-400 mb-3" size={32} />
                <p className="text-gray-600">Nenhuma arma cadastrada para este cliente ainda.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {weapons.map((weapon) => (
                  <div key={weapon.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <p className="font-medium text-gray-900">
                          {weapon.model || 'Modelo não informado'}
                          {weapon.manufacturer ? ` - ${weapon.manufacturer}` : ''}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Série: {weapon.serial_number}
                          {weapon.caliber ? ` · Calibre: ${weapon.caliber}` : ''}
                          {weapon.registration_number ? ` · Registro: ${weapon.registration_number}` : ''}
                        </p>
                      </div>
                      {weapon.category && (
                        <span className="text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full px-3 py-1">
                          {weapon.category}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <DateBadge label="CRAF vence" dateStr={weapon.expiration_date} />
                      <DateBadge label="Guia de Tráfego vence" dateStr={weapon.traffic_guide_expiration} />
                      {weapon.traffic_guide_status && (
                        <span className="text-xs font-medium border rounded-full px-3 py-1 bg-blue-50 border-blue-200 text-blue-700">
                          Guia: {TRAFFIC_GUIDE_STATUS.find((s) => s.value === weapon.traffic_guide_status)?.label}
                        </span>
                      )}
                    </div>
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
          <Input
            label="Prazo (data limite)"
            type="date"
            value={form.deadline_at}
            onChange={(e) => setForm((p) => ({ ...p, deadline_at: e.target.value }))}
            helper="Data limite para protocolar ou responder uma exigência, se houver."
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

      <Modal
        isOpen={weaponModalOpen}
        onClose={() => setWeaponModalOpen(false)}
        title="Nova Arma"
        footer={
          <>
            <Button variant="secondary" onClick={() => setWeaponModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" isLoading={savingWeapon} onClick={handleCreateWeapon}>
              Cadastrar Arma
            </Button>
          </>
        }
      >
        {weaponError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {weaponError}
          </div>
        )}
        <div className="space-y-4">
          <Input
            label="Número de Série *"
            value={weaponForm.serial_number}
            onChange={(e) => setWeaponForm((p) => ({ ...p, serial_number: e.target.value }))}
            placeholder="Número de série da arma"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Modelo"
              value={weaponForm.model}
              onChange={(e) => setWeaponForm((p) => ({ ...p, model: e.target.value }))}
              placeholder="Ex: Taurus G2C"
            />
            <Input
              label="Fabricante"
              value={weaponForm.manufacturer}
              onChange={(e) => setWeaponForm((p) => ({ ...p, manufacturer: e.target.value }))}
              placeholder="Ex: Taurus"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Calibre"
              value={weaponForm.caliber}
              onChange={(e) => setWeaponForm((p) => ({ ...p, caliber: e.target.value }))}
              placeholder="Ex: .380"
            />
            <Select
              label="Categoria"
              value={weaponForm.category}
              onChange={(e) => setWeaponForm((p) => ({ ...p, category: e.target.value }))}
              options={CATEGORIES}
            />
          </div>
          <Input
            label="Número de Registro (CRAF)"
            value={weaponForm.registration_number}
            onChange={(e) => setWeaponForm((p) => ({ ...p, registration_number: e.target.value }))}
            placeholder="Número de registro no Exército"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Data de Registro"
              type="date"
              value={weaponForm.registration_date}
              onChange={(e) => setWeaponForm((p) => ({ ...p, registration_date: e.target.value }))}
            />
            <Input
              label="Validade do CRAF"
              type="date"
              value={weaponForm.expiration_date}
              onChange={(e) => setWeaponForm((p) => ({ ...p, expiration_date: e.target.value }))}
              helper="Data em que o registro da arma vence."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Status da Guia de Tráfego"
              value={weaponForm.traffic_guide_status}
              onChange={(e) => setWeaponForm((p) => ({ ...p, traffic_guide_status: e.target.value }))}
              options={TRAFFIC_GUIDE_STATUS}
            />
            <Input
              label="Validade da Guia de Tráfego"
              type="date"
              value={weaponForm.traffic_guide_expiration}
              onChange={(e) => setWeaponForm((p) => ({ ...p, traffic_guide_expiration: e.target.value }))}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
