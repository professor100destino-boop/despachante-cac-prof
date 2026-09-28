-- ============================================================================
-- DESPACHANTE CAC PROF - Database Setup
-- ============================================================================
-- CriaÃ§Ã£o de todas as tabelas para o sistema de gestÃ£o de CAC

-- ============================================================================
-- 1. TABELA: USERS (Despachantes)
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  subscription_plan TEXT DEFAULT 'free', -- free, pro, enterprise
  subscription_status TEXT DEFAULT 'active',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 2. TABELA: CLIENTS (Clientes dos Despachantes)
-- ============================================================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cpf TEXT NOT NULL,
  rg TEXT,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(owner_id, cpf)
);

-- ============================================================================
-- 3. TABELA: PROCESSES (Processos de CAC, Porte, Posse, Compra)
-- ============================================================================
CREATE TABLE IF NOT EXISTS processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  process_type TEXT NOT NULL, -- 'CAC', 'PORTE', 'POSSE', 'COMPRA', 'RENOVACAO'
  category TEXT, -- 'ATIRADOR', 'COLECIONADOR', 'CACADOR' (for CAC)
  status TEXT DEFAULT 'rascunho', -- rascunho, enviado, em_analise, aprovado, indeferido
  priority TEXT DEFAULT 'normal', -- low, normal, high
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deadline_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- ============================================================================
-- 4. TABELA: WEAPONS (Armas Registradas)
-- ============================================================================
CREATE TABLE IF NOT EXISTS weapons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  serial_number TEXT NOT NULL,
  caliber TEXT,
  model TEXT,
  manufacturer TEXT,
  category TEXT, -- Atirador, Colecionador, CaÃ§ador
  registration_number TEXT,
  registration_date TIMESTAMP WITH TIME ZONE,
  expiration_date TIMESTAMP WITH TIME ZONE,
  traffic_guide_status TEXT, -- ativa, expirada, pendente
  traffic_guide_expiration TIMESTAMP WITH TIME ZONE,
  last_inspection TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(client_id, serial_number)
);

-- ============================================================================
-- 5. TABELA: DOCUMENTS (Arquivos e Documentos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  process_id UUID REFERENCES processes(id) ON DELETE CASCADE,
  weapon_id UUID REFERENCES weapons(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT, -- pdf, image, doc, etc
  file_size INTEGER,
  storage_path TEXT NOT NULL,
  description TEXT,
  tags TEXT[], -- array de tags para categorizaÃ§Ã£o
  version INTEGER DEFAULT 1,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 6. TABELA: CHECKLISTS (Templates de Checklists)
-- ============================================================================
CREATE TABLE IF NOT EXISTS checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  process_type TEXT NOT NULL, -- CAC, PORTE, POSSE, COMPRA
  category TEXT, -- ATIRADOR, COLECIONADOR, CACADOR
  title TEXT NOT NULL,
  description TEXT,
  items JSONB NOT NULL, -- Array de items do checklist
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_template BOOLEAN DEFAULT TRUE
);

-- ============================================================================
-- 7. TABELA: CHECKLIST INSTANCES (InstÃ¢ncias de Checklists Preenchidas)
-- ============================================================================
CREATE TABLE IF NOT EXISTS checklist_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checklist_id UUID NOT NULL REFERENCES checklists(id) ON DELETE CASCADE,
  process_id UUID NOT NULL REFERENCES processes(id) ON DELETE CASCADE,
  completed_items JSONB DEFAULT '[]',
  progress_percentage INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 8. TABELA: DEADLINES (Prazos e Lembretes)
-- ============================================================================
CREATE TABLE IF NOT EXISTS deadlines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  process_id UUID REFERENCES processes(id) ON DELETE CASCADE,
  weapon_id UUID REFERENCES weapons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  deadline_date TIMESTAMP WITH TIME ZONE NOT NULL,
  priority TEXT DEFAULT 'normal', -- low, normal, high, urgent
  reminder_days INTEGER[] DEFAULT '{3, 7, 15, 30}',
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 9. TABELA: KNOWLEDGE BASE (Base de Conhecimento)
-- ============================================================================
CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT, -- Guia, Legislacao, FAQ, Processo, Noticia
  subcategory TEXT,
  tags TEXT[],
  author TEXT,
  search_vector tsvector,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 10. TABELA: COMMUNICATIONS (HistÃ³rico de ComunicaÃ§Ãµes)
-- ============================================================================
CREATE TABLE IF NOT EXISTS communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  process_id UUID REFERENCES processes(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- nota, email, sms, chamada, documento
  content TEXT,
  attachments TEXT[],
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 11. INDEXES para Performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_clients_owner ON clients(owner_id);
CREATE INDEX IF NOT EXISTS idx_clients_cpf ON clients(cpf);
CREATE INDEX IF NOT EXISTS idx_processes_client ON processes(client_id);
CREATE INDEX IF NOT EXISTS idx_processes_status ON processes(status);
CREATE INDEX IF NOT EXISTS idx_weapons_client ON weapons(client_id);
CREATE INDEX IF NOT EXISTS idx_documents_owner ON documents(owner_id);
CREATE INDEX IF NOT EXISTS idx_documents_client ON documents(client_id);
CREATE INDEX IF NOT EXISTS idx_deadlines_owner ON deadlines(owner_id);
CREATE INDEX IF NOT EXISTS idx_deadlines_deadline_date ON deadlines(deadline_date);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_tags ON knowledge_base USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_communications_client ON communications(client_id);

-- ============================================================================
-- 12. ROW LEVEL SECURITY (RLS) - SeguranÃ§a
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE weapons ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE deadlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for clients
CREATE POLICY "Users can view own clients" ON clients
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own clients" ON clients
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own clients" ON clients
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own clients" ON clients
  FOR DELETE USING (auth.uid() = owner_id);

-- RLS Policies for processes
CREATE POLICY "Users can view client processes" ON processes
  FOR SELECT USING (
    auth.uid() = (SELECT owner_id FROM clients WHERE id = processes.client_id)
  );

CREATE POLICY "Users can insert processes" ON processes
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT owner_id FROM clients WHERE id = processes.client_id)
  );

CREATE POLICY "Users can update processes" ON processes
  FOR UPDATE USING (
    auth.uid() = (SELECT owner_id FROM clients WHERE id = processes.client_id)
  );

-- RLS Policies for weapons
CREATE POLICY "Users can view client weapons" ON weapons
  FOR SELECT USING (
    auth.uid() = (SELECT owner_id FROM clients WHERE id = weapons.client_id)
  );

CREATE POLICY "Users can insert weapons" ON weapons
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT owner_id FROM clients WHERE id = weapons.client_id)
  );

CREATE POLICY "Users can update weapons" ON weapons
  FOR UPDATE USING (
    auth.uid() = (SELECT owner_id FROM clients WHERE id = weapons.client_id)
  );

-- RLS Policies for documents
CREATE POLICY "Users can view own documents" ON documents
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own documents" ON documents
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- RLS Policies for knowledge_base
CREATE POLICY "Anyone can view published knowledge" ON knowledge_base
  FOR SELECT USING (published = TRUE);

-- ============================================================================
-- 13. FUNC æES ÃTEIS
-- ============================================================================

-- FunÃ§Ã£o para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_processes_updated_at BEFORE UPDATE ON processes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weapons_updated_at BEFORE UPDATE ON weapons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_checklists_updated_at BEFORE UPDATE ON checklists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deadlines_updated_at BEFORE UPDATE ON deadlines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 14. INSERIR DADOS INICIAIS (Base de Conhecimento)
-- ============================================================================

INSERT INTO knowledge_base (title, content, category, tags, published)
VALUES
  (
    'Como obter CAC em 5 passos',
    'Passo 1: Preparar documentaÃ§Ã£o\nPasso 2: Enviar ao ExÃ©rcito\nPasso 3: AnÃ¡lise\nPasso 4: Entrevista\nPasso 5: AprovaÃ§Ã£o',
    'Guia',
    ARRAY['CAC', 'Processo', 'Iniciante'],
    TRUE
  ),
  (
    'DiferenÃ§a entre POSSE e PORTE',
    'POSSE: Arma em casa, segura\nPORTE: Arma na rua com guia de trÃ¡fego',
    'Guia',
    ARRAY['Legislacao', 'Importante'],
    TRUE
  ),
  (
    'Lei nÂº 10.826/2003 - Estatuto do Desarmamento',
    'LegislaÃ§Ã£o principal que regulamenta armas de fogo no Brasil',
    'Legislacao',
    ARRAY['Lei', 'Oficial'],
    TRUE
  ),
  (
    'Decreto nÂº 11.366/2023 - AtualizaÃ§Ãµes',
    'Decreto recente que alterou regras de transporte de armas',
    'Legislacao',
    ARRAY['Decreto', 'Atualizado', '2023'],
    TRUE
  ),
  (
    'O que levar em uma fiscalizaÃ§Ã£o',
    'Checklist com tudo que um CAC deve levar em uma fiscalizaÃ§Ã£o do ExÃ©rcito',
    'Checklist',
    ARRAY['Fiscalizacao', 'Importante'],
    TRUE
  );

-- ============================================================================
-- FIM DO SETUP
-- ============================================================================
-- Todas as tabelas foram criadas com sucesso!
-- As polÃ­ticas de RLS estÃ£o ativas para seguranÃ§a
-- Base de conhecimento inicializada
