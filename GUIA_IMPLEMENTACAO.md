# GUIA DE IMPLEMENTAÃÃO - DESPACHANTE CAC PROF

## ð Resumo
Este guia mostra passo a passo como implementar o **DESPACHANTE CAC PROF** - um PWA especializado em despachantia para CAC, Porte e Posse de Arma.

VocÃª jÃ¡ tem:
- â Projeto Supabase criado (`prova-facil`)
- â Credenciais de acesso
- â Banco de dados estruturado (`setup_database.sql`)
- â Projeto React scaffolding completo
- â Componentes base e autenticaÃ§Ã£o

---

## ð§ PASSO 1: Executar o Schema do Banco de Dados

### O que fazer:
O arquivo `setup_database.sql` contÃ©m todas as tabelas, Ã­ndices e polÃ­ticas de seguranÃ§a (RLS).

### Como executar:

1. **Acesse o Supabase SQL Editor:**
   ```
   https://supabase.com/dashboard/project/elmnlvylhuzfnarjzdxy/sql
   ```

2. **Clique em "New Query"** (canto superior direito)

3. **Cole todo o conteÃºdo do arquivo `setup_database.sql`:**
   - O arquivo estÃ¡ no scratchpad
   - Copie TODO o conteÃºdo (linhas 1-360)

4. **Clique em "Run"** ou pressione `Ctrl+Enter`

5. **Aguarde a execuÃ§Ã£o:**
   - VocÃª verÃ¡ mensagens de sucesso para cada tabela criada
   - Leia a mensagem final de confirmaÃ§Ã£o

### Tabelas criadas:
- `users` - Despachantes
- `clients` - Clientes dos despachantes
- `processes` - Processos (CAC, Porte, Posse, Compra, RenovaÃ§Ã£o)
- `weapons` - Armas registradas
- `documents` - Arquivos e documentos
- `checklists` - Templates de checklists
- `checklist_instances` - InstÃ¢ncias preenchidas
- `deadlines` - Prazos e lembretes
- `knowledge_base` - Base de conhecimento
- `communications` - HistÃ³rico de comunicaÃ§Ãµes

**â VocÃª saberÃ¡ que funcionou quando nÃ£o houver erros vermelhos.**

---

## ð» PASSO 2: Configurar o Projeto React Localmente

### PrÃ©-requisitos:
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
- `tsconfig.node.json` (crie uma cÃ³pia simples de tsconfig.json)
- `tailwind.config.js`
- `postcss.config.js`
- `.env.example` â renomear para `.env.local`
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

#### 4. **Instalar dependÃªncias:**
```bash
npm install
```

Isso instalarÃ¡:
- React 18
- React Router
- Supabase Client
- Zustand (state management)
- Tailwind CSS
- TypeScript
- Vite (build tool)
- E mais...

**Aguarde atÃ© aparecer "added X packages"**

#### 5. **Configurar variÃ¡veis de ambiente:**

Abra `.env.local` e verifique se tem:
```env
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_AQUI
VITE_APP_NAME=DESPACHANTE CAC PROF
```

---

## ð PASSO 3: Executar o Projeto em Desenvolvimento

### Comando:
```bash
npm run dev
```

### O que acontecerÃ¡:
1. Vite iniciarÃ¡ um servidor local em `http://localhost:3000`
2. O navegador abrirÃ¡ automaticamente
3. VocÃª verÃ¡ a pÃ¡gina de Login

### Se der erro:
- **Port 3000 jÃ¡ estÃ¡ em uso?** Rode `npm run dev -- --port 3001`
- **Erro de Node modules?** Delete `node_modules` e rode `npm install` novamente
- **Erro de tipos TypeScript?** Rode `npm run build` para ver detalhes

---

## ð§ª PASSO 4: Testar a AutenticaÃ§Ã£o

### Na pÃ¡gina de Login:

1. **Clique em "Criar Nova Conta"**
2. **Preencha:**
   - Nome Completo: ex. "JoÃ£o Silva"
   - Nome da Empresa: ex. "Despachante CAC Silva"
   - E-mail: seu@email.com
   - Senha: qualquer senha (mÃ­n. 6 caracteres)
3. **Clique em "Criar Conta"**

### Esperado:
â VocÃª serÃ¡ redirecionado para o Dashboard  
â VerÃ¡ seu nome e empresa na pÃ¡gina  
â Dashboard mostrarÃ¡ estatÃ­sticas vazias (0 clientes, 0 processos)  

### Se der erro:
- Verifique se o setup_database.sql foi executado com sucesso
- Verifique se as credenciais do Supabase estÃ£o corretas em `.env.local`

---

## ð± PASSO 5: Construir para ProduÃ§Ã£o

### Comando:
```bash
npm run build
```

### Resultado:
- Pasta `dist/` serÃ¡ criada
- ContÃ©m todos os arquivos minificados e otimizados
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

## ð SeguranÃ§a & Dados

### Row Level Security (RLS) ativada:
- Cada despachante sÃ³ vÃª seus prÃ³prios clientes
- Cada despachante sÃ³ vÃª seus prÃ³prios processos
- Documentos sÃ£o isolados por usuÃ¡rio
- Tudo automÃ¡tico via Supabase

### Criptografia:
- Senhas: hash com bcrypt (Supabase)
- ComunicaÃ§Ã£o: HTTPS obrigatÃ³rio
- Dados em repouso: criptografados no Supabase

### Backup:
- Supabase faz backup automÃ¡tico diariamente
- RetenÃ§Ã£o de 30 dias de backups

---

## ð¨ PrÃ³ximos Passos (MVP)

Com o projeto rodando, vocÃª pode:

1. **Adicionar pÃ¡gina de Clientes:**
   - FormulÃ¡rio de cadastro
   - CRUD completo
   - Upload de documentos

2. **Gerador de Checklists:**
   - Templates por tipo de processo (CAC, Porte, etc)
   - Marcar itens como completos
   - Calcular progresso

3. **Base de Conhecimento:**
   - Artigos sobre legislaÃ§Ã£o
   - Busca full-text
   - CategorizaÃ§Ã£o

4. **Gerenciador de Prazos:**
   - CalendÃ¡rio visual
   - NotificaÃ§Ãµes automÃ¡ticas
   - IntegraÃ§Ã£o com Google Calendar

5. **Simulador de Custos:**
   - Estimativa por processo
   - VariaÃ§Ãµes por regiÃ£o
   - GeraÃ§Ã£o de PDF

---

## ð Troubleshooting

### Problema: "Cannot find module"
**SoluÃ§Ã£o:** Verifique se os caminhos de importaÃ§Ã£o estÃ£o corretos (sem ou com `.tsx`)

### Problema: "Supabase connection refused"
**SoluÃ§Ã£o:** Verifique as credenciais em `.env.local`

### Problema: "Port already in use"
**SoluÃ§Ã£o:** `npm run dev -- --port 3001`

### Problema: "CORS error"
**SoluÃ§Ã£o:** O Supabase deve estar com CORS configurado (geralmente automÃ¡tico)

### Problema: "Can't login"
**SoluÃ§Ã£o:** Verifique se `setup_database.sql` foi executado e se a tabela `users` existe

---

## ð Arquitetura

```
DESPACHANTE CAC PROF
âââ Frontend (React + Vite)
â   âââ Pages: Login, Dashboard, Clients, Processes, etc.
â   âââ Components: Button, Card, Input, Modal
â   âââ Store: Zustand (auth, clients, processes)
â   âââ Utils: Supabase client, types
âââ Backend (Supabase)
â   âââ Auth: OAuth + Email/Password
â   âââ Database: PostgreSQL com RLS
â   âââ Storage: Documentos e arquivos
â   âââ Edge Functions: APIs customizadas (futuro)
âââ PWA
    âââ Service Worker: Offline-first
    âââ Manifest: Installable
    âââ Responsive: Mobile + Desktop
```

---

## â Checklist de VerificaÃ§Ã£o

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

**Status: Pronto para Desenvolvimento! ð**

Qualquer dÃºvida, revise este guia ou consulte a documentaÃ§Ã£o oficial:
- React: https://react.dev
- Supabase: https://supabase.com/docs
- Tailwind: https://tailwindcss.com
- Vite: https://vitejs.dev
