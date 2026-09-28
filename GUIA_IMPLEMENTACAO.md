# GUIA DE IMPLEMENTAÇÃO - DESPACHANTE CAC PROF

## 📋 Resumo
Este guia mostra passo a passo como implementar o **DESPACHANTE CAC PROF** - um PWA especializado em despachantia para CAC, Porte e Posse de Arma.

Você já tem:
- ✅ Projeto Supabase criado (`prova-facil`)
- ✅ Credenciais de acesso
- ✅ Banco de dados estruturado (`setup_database.sql`)
- ✅ Projeto React scaffolding completo
- ✅ Componentes base e autenticação

---

## 🔧 PASSO 1: Executar o Schema do Banco de Dados

### O que fazer:
O arquivo `setup_database.sql` contém todas as tabelas, índices e políticas de segurança (RLS).

### Como executar:

1. **Acesse o Supabase SQL Editor:**
   ```
   https://supabase.com/dashboard/project/SEU_PROJETO_ID/sql
   ```

2. **Clique em "New Query"** (canto superior direito)

3. **Cole todo o conteúdo do arquivo `setup_database.sql`:**
   - O arquivo está no scratchpad
   - Copie TODO o conteúdo (linhas 1-360)

4. **Clique em "Run"** ou pressione `Ctrl+Enter`

5. **Aguarde a execução:**
   - Você verá mensagens de sucesso para cada tabela criada
   - Leia a mensagem final de confirmação

### Tabelas criadas:
- `users` - Despachantes
- `clients` - Clientes dos despachantes
- `processes` - Processos (CAC, Porte, Posse, Compra, Renovação)
- `weapons` - Armas registradas
- `documents` - Arquivos e documentos
- `checklists` - Templates de checklists
- `checklist_instances` - Instâncias preenchidas
- `deadlines` - Prazos e lembretes
- `knowledge_base` - Base de conhecimento
- `communications` - Histórico de comunicações

**✅ Você saberá que funcionou quando não houver erros vermelhos.**

---

## 💻 PASSO 2: Configurar o Projeto React Localmente

### Pré-requisitos:
- Node.js 18+ instalado
- npm ou yarn
- Terminal/Prompt de comando

### Passos:

#### 1. **Criar pasta do projeto:**
```bash
mkdir despachante-cac-prof
cd despachante-cac-prof
```

#### 2. **Criar estrutura de pastas:**
```bash
mkdir -p src/components src/pages src/hooks src/store src/utils src/types
mkdir -p public
```

#### 3. **Copiar arquivos do scratchpad:**
Todos os arquivos fornecidos devem ser copiados para as pastas corretas:

**Na raiz do projeto:**
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `tsconfig.node.json` (crie uma cópia simples de tsconfig.json)
- `tailwind.config.js`
- `postcss.config.js`
- `.env.example` → renomear para `.env.local`
- `index.html`

**Em src/:**
- `main.tsx` (renomear de `src-main.tsx`)
- `App.tsx` (renomear de `src-App.tsx`)
- `index.css` (renomear de `src-index.css`)
- `supabase.ts` (renomear de `src-supabase.ts`)

**Em src/components/:**
- `Button.tsx` (renomear de `src-components-Button.tsx`)
- `Card.tsx` (renomear de `src-components-Card.tsx`)
- `Input.tsx` (renomear de `src-components-Input.tsx`)
- `Modal.tsx` (renomear de `src-components-Modal.tsx`)
- `index.ts` (renomear de `src-components-index.ts`)

**Em src/store/:**
- `auth.ts` (renomear de `src-store-auth.ts`)

**Em src/pages/:**
- `Login.tsx` (renomear de `src-pages-Login.tsx`)
- `Dashboard.tsx` (renomear de `src-pages-Dashboard.tsx`)

#### 4. **Instalar dependências:**
```bash
npm install
```

Isso instalará:
- React 18
- React Router
- Supabase Client
- Zustand (state management)
- Tailwind CSS
- TypeScript
- Vite (build tool)
- E mais...

**Aguarde até aparecer "added X packages"**

#### 5. **Configurar variáveis de ambiente:**

Abra `.env.local` e verifique se tem:
```env
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_AQUI
VITE_APP_NAME=DESPACHANTE CAC PROF
```

---

## 🚀 PASSO 3: Executar o Projeto em Desenvolvimento

### Comando:
```bash
npm run dev
```

### O que acontecerá:
1. Vite iniciará um servidor local em `http://localhost:3000`
2. O navegador abrirá automaticamente
3. Você verá a página de Login

### Se der erro:
- **Port 3000 já está em uso?** Rode `npm run dev -- --port 3001`
- **Erro de Node modules?** Delete `node_modules` e rode `npm install` novamente
- **Erro de tipos TypeScript?** Rode `npm run build` para ver detalhes

---

## 🧪 PASSO 4: Testar a Autenticação

### Na página de Login:

1. **Clique em "Criar Nova Conta"**
2. **Preencha:**
   - Nome Completo: ex. "João Silva"
   - Nome da Empresa: ex. "Despachante CAC Silva"
   - E-mail: seu@email.com
   - Senha: qualquer senha (mín. 6 caracteres)
3. **Clique em "Criar Conta"**

### Esperado:
✅ Você será redirecionado para o Dashboard  
✅ Verá seu nome e empresa na página  
✅ Dashboard mostrará estatísticas vazias (0 clientes, 0 processos)  

### Se der erro:
- Verifique se o setup_database.sql foi executado com sucesso
- Verifique se as credenciais do Supabase estão corretas em `.env.local`

---

## 📱 PASSO 5: Construir para Produção

### Comando:
```bash
npm run build
```

### Resultado:
- Pasta `dist/` será criada
- Contém todos os arquivos minificados e otimizados
- Pronto para fazer deploy em qualquer servidor

### Deploy (exemplos):

**Vercel (recomendado para PWA):**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy
```

**Supabase Storage:**
```bash
supabase link
supabase projects list
# ... follow instructions
```

---

## 🔐 Segurança & Dados

### Row Level Security (RLS) ativada:
- Cada despachante só vê seus próprios clientes
- Cada despachante só vê seus próprios processos
- Documentos são isolados por usuário
- Tudo automático via Supabase

### Criptografia:
- Senhas: hash com bcrypt (Supabase)
- Comunicação: HTTPS obrigatório
- Dados em repouso: criptografados no Supabase

### Backup:
- Supabase faz backup automático diariamente
- Retenção de 30 dias de backups

---

## 🎨 Próximos Passos (MVP)

Com o projeto rodando, você pode:

1. **Adicionar página de Clientes:**
   - Formulário de cadastro
   - CRUD completo
   - Upload de documentos

2. **Gerador de Checklists:**
   - Templates por tipo de processo (CAC, Porte, etc)
   - Marcar itens como completos
   - Calcular progresso

3. **Base de Conhecimento:**
   - Artigos sobre legislação
   - Busca full-text
   - Categorização

4. **Gerenciador de Prazos:**
   - Calendário visual
   - Notificações automáticas
   - Integração com Google Calendar

5. **Simulador de Custos:**
   - Estimativa por processo
   - Variações por região
   - Geração de PDF

---

## 📞 Troubleshooting

### Problema: "Cannot find module"
**Solução:** Verifique se os caminhos de importação estão corretos (sem ou com `.tsx`)

### Problema: "Supabase connection refused"
**Solução:** Verifique as credenciais em `.env.local`

### Problema: "Port already in use"
**Solução:** `npm run dev -- --port 3001`

### Problema: "CORS error"
**Solução:** O Supabase deve estar com CORS configurado (geralmente automático)

### Problema: "Can't login"
**Solução:** Verifique se `setup_database.sql` foi executado e se a tabela `users` existe

---

## 📊 Arquitetura

```
DESPACHANTE CAC PROF
├── Frontend (React + Vite)
│   ├── Pages: Login, Dashboard, Clients, Processes, etc.
│   ├── Components: Button, Card, Input, Modal
│   ├── Store: Zustand (auth, clients, processes)
│   └── Utils: Supabase client, types
├── Backend (Supabase)
│   ├── Auth: OAuth + Email/Password
│   ├── Database: PostgreSQL com RLS
│   ├── Storage: Documentos e arquivos
│   └── Edge Functions: APIs customizadas (futuro)
└── PWA
    ├── Service Worker: Offline-first
    ├── Manifest: Installable
    └── Responsive: Mobile + Desktop
```

---

## ✅ Checklist de Verificação

- [ ] Projeto Supabase criado e ativo
- [ ] setup_database.sql executado com sucesso
- [ ] Node.js 18+ instalado
- [ ] Projeto React clonado/criado
- [ ] npm install executado
- [ ] .env.local configurado com credenciais
- [ ] npm run dev funcionando
- [ ] Login funcionando
- [ ] Dashboard exibindo corretamente
- [ ] PWA manifest aparecendo (devtools)

---

**Status: Pronto para Desenvolvimento! 🚀**

Qualquer dúvida, revise este guia ou consulte a documentação oficial:
- React: https://react.dev
- Supabase: https://supabase.com/docs
- Tailwind: https://tailwindcss.com
- Vite: https://vitejs.dev
