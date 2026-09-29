import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, Search } from 'lucide-react'
import { supabase, type KnowledgeBaseArticle } from '../supabase'
import { Card, CardBody, Input } from '../components'

export const KnowledgeBase = () => {
  const navigate = useNavigate()
  const [articles, setArticles] = useState<KnowledgeBaseArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('published', true)
        .order('category', { ascending: true })
      setArticles((data as KnowledgeBaseArticle[]) || [])
      setLoading(false)
    }
    fetchArticles()
  }, [])

  const filtered = useMemo(() => {
    if (!query.trim()) return articles
    const q = query.toLowerCase()
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        (a.tags || []).some((t) => t.toLowerCase().includes(q))
    )
  }, [articles, query])

  const grouped = useMemo(() => {
    const map = new Map<string, KnowledgeBaseArticle[]>()
    filtered.forEach((a) => {
      const cat = a.category || 'Outros'
      if (!map.has(cat)) map.set(cat, [])
      map.get(cat)!.push(a)
    })
    return Array.from(map.entries())
  }, [filtered])

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
              <BookOpen className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Base de Conhecimento</h1>
              <p className="text-gray-600">Legislação, prazos e checklists de referência para CAC.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Input
          icon={<Search size={18} />}
          placeholder="Buscar por termo, ex: CRAF, guia de tráfego, decreto..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {loading ? (
          <p className="text-gray-600">Carregando...</p>
        ) : grouped.length === 0 ? (
          <p className="text-gray-600 text-center py-8">Nenhum artigo encontrado para essa busca.</p>
        ) : (
          grouped.map(([category, items]) => (
            <div key={category}>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">{category}</h2>
              <div className="space-y-3">
                {items.map((article) => (
                  <Card key={article.id}>
                    <CardBody>
                      <h3 className="font-medium text-gray-900 mb-1">{article.title}</h3>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{article.content}</p>
                      {article.tags && article.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {article.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2.5 py-1"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  )
}
