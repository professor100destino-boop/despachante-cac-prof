import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import { supabase, type Client, type Process } from '../supabase'
import { Button, Card, CardHeader, CardBody } from '../components'
import { LogOut, Plus, Users, FileText, Clock, CheckCircle, AlertTriangle, BookOpen } from 'lucide-react'

type Alert = {
  key: string
  clientId: string
  clientName: string
  label: string
  date: string
  days: number
}

export const Dashboard = () => {
  const navigate = useNavigate()
  const { user, signOut } = useAuthStore()
  const [clients, setClients] = useState<Client[]>([])
  const [processes, setProcesses] = useState<Process[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchData()
  }, [user, navigate])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch clients
      const { data: clientsData } = await supabase
        .from('clients')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false })

      // Fetch processes
      const { data: processesData } = await supabase
        .from('processes')
        .select(
          `
          *,
          clients (
            full_name
          )
        `
        )
        .eq('clients.owner_id', user?.id)
        .order('updated_at', { ascending: false })

      setClients(clientsData || [])
      setProcesses(processesData || [])

      // Fetch weapons (joined with clients to scope by owner) to build the
      // deadlines/alerts panel: CRAF expiration and Guia de Tráfego expiration.
      const { data: weaponsData } = await supabase
        .from('weapons')
        .select('id, model, expiration_date, traffic_guide_expiration, client_id, clients!inner(full_name, owner_id)')
        .eq('clients.owner_id', user?.id)

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const daysUntil = (dateStr: string) => {
        const target = new Date(dateStr)
        target.setHours(0, 0, 0, 0)
        return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      }

      const computedAlerts: Alert[] = []

      type WeaponRow = {
        id: string
        model: string | null
        expiration_date: string | null
        traffic_guide_expiration: string | null
        client_id: string
        clients: { full_name: string; owner_id: string } | { full_name: string; owner_id: string }[]
      }
      ;((weaponsData as WeaponRow[] | null) || []).forEach((w) => {
        const clientInfo = Array.isArray(w.clients) ? w.clients[0] : w.clients
        const clientName = clientInfo?.full_name || 'Cliente'
        if (w.expiration_date) {
          computedAlerts.push({
            key: `${w.id}-craf`,
            clientId: w.client_id,
            clientName,
            label: `CRAF${w.model ? ` (${w.model})` : ''}`,
            date: w.expiration_date,
            days: daysUntil(w.expiration_date),
          })
        }
        if (w.traffic_guide_expiration) {
          computedAlerts.push({
            key: `${w.id}-gte`,
            clientId: w.client_id,
            clientName,
            label: `Guia de Tráfego${w.model ? ` (${w.model})` : ''}`,
            date: w.traffic_guide_expiration,
            days: daysUntil(w.traffic_guide_expiration),
          })
        }
      })
      ;((processesData as (Process & { clients?: { full_name: string } })[] | null) || []).forEach((p) => {
        if (p.deadline_at && !p.completed_at) {
          computedAlerts.push({
            key: `${p.id}-deadline`,
            clientId: p.client_id,
            clientName: p.clients?.full_name || 'Cliente',
            label: `Prazo do processo (${p.process_type})`,
            date: p.deadline_at,
            days: daysUntil(p.deadline_at),
          })
        }
      })

      // Only show what's overdue or coming up in the next 60 days, nearest first.
      computedAlerts.sort((a, b) => a.days - b.days)
      setAlerts(computedAlerts.filter((a) => a.days <= 60))
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    window.location.assign(`${import.meta.env.BASE_URL}login`)
  }

  const stats = {
    totalClients: clients.length,
    activeProcesses: processes.filter((p) => p.status !== 'aprovado' && p.status !== 'indeferido').length,
    completedProcesses: processes.filter((p) => p.status === 'aprovado').length,
    pendingDeadlines: alerts.length,
  }

  const alertClasses = (days: number) => {
    if (days < 0) return 'bg-red-50 border-red-300 text-red-800'
    if (days <= 15) return 'bg-orange-50 border-orange-300 text-orange-800'
    return 'bg-yellow-50 border-yellow-200 text-yellow-800'
  }

  const alertText = (days: number) => {
    if (days < 0) return `Vencido há ${Math.abs(days)} dia(s)`
    if (days === 0) return 'Vence hoje'
    return `Vence em ${days} dia(s)`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">DESPACHANTE CAC PROF</h1>
              <p className="text-gray-600 mt-1">Bem-vindo, {user?.full_name || user?.email}</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleLogout}
                icon={<LogOut size={18} />}
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total de Clientes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalClients}</p>
              </div>
              <Users className="text-blue-600" size={32} />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Processos Ativos</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.activeProcesses}</p>
              </div>
              <FileText className="text-yellow-600" size={32} />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Processos Aprovados</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.completedProcesses}</p>
              </div>
              <CheckCircle className="text-green-600" size={32} />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Prazos Pendentes (60 dias)</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.pendingDeadlines}</p>
              </div>
              <Clock className="text-red-600" size={32} />
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="mb-8 flex flex-wrap gap-3">
          <Button
            variant="primary"
            icon={<Plus size={18} />}
            onClick={() => navigate('/clients/new')}
          >
            Novo Cliente
          </Button>
          <Button
            variant="secondary"
            icon={<BookOpen size={18} />}
            onClick={() => navigate('/base-de-conhecimento')}
          >
            Base de Conhecimento
          </Button>
        </div>

        {/* Deadlines / Alerts Section */}
        <Card className="mb-8">
          <CardHeader title="Prazos e Vencimentos (próximos 60 dias)" />
          <CardBody>
            {loading ? (
              <p className="text-gray-600">Carregando...</p>
            ) : alerts.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle className="mx-auto text-green-500 mb-3" size={32} />
                <p className="text-gray-600">Nenhum prazo ou vencimento nos próximos 60 dias. Tudo em dia.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <div
                    key={alert.key}
                    className={`flex items-center justify-between gap-3 p-3 rounded-lg border cursor-pointer hover:opacity-90 ${alertClasses(alert.days)}`}
                    onClick={() => navigate(`/clients/${alert.clientId}`)}
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle size={18} />
                      <div>
                        <p className="font-medium">
                          {alert.clientName} · {alert.label}
                        </p>
                        <p className="text-sm">
                          {new Date(alert.date).toLocaleDateString('pt-BR')} — {alertText(alert.days)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Clients Section */}
        <Card className="mb-8">
          <CardHeader title="Clientes Recentes" />
          <CardBody>
            {loading ? (
              <p className="text-gray-600">Carregando...</p>
            ) : clients.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto text-gray-400 mb-3" size={32} />
                <p className="text-gray-600">Nenhum cliente cadastrado ainda.</p>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-4"
                  onClick={() => navigate('/clients/new')}
                >
                  Cadastrar Primeiro Cliente
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Nome</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">CPF</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Telefone</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Cidade</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.slice(0, 5).map((client) => (
                      <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{client.full_name}</td>
                        <td className="py-3 px-4 text-gray-600">{client.cpf || '-'}</td>
                        <td className="py-3 px-4 text-gray-600">{client.phone || '-'}</td>
                        <td className="py-3 px-4 text-gray-600">{client.city || '-'}</td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate(`/clients/${client.id}`)}
                          >
                            Ver
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Processes Section */}
        <Card>
          <CardHeader title="Processos Recentes" />
          <CardBody>
            {loading ? (
              <p className="text-gray-600">Carregando...</p>
            ) : processes.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto text-gray-400 mb-3" size={32} />
                <p className="text-gray-600">Nenhum processo cadastrado ainda.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {processes.slice(0, 5).map((process) => (
                  <div
                    key={process.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/clients/${process.client_id}`)}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {process.process_type} - {process.description || 'Sem descrição'}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Status: <span className="font-medium capitalize">{process.status.replace('_', ' ')}</span>
                      </p>
                    </div>
                    <Button variant="secondary" size="sm">
                      Ver Detalhes
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </main>
    </div>
  )
}
