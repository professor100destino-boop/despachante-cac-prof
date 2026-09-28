# DESPACHANTE CAC PRO â Plano de Projeto

## ð VISÃO GERAL

Um **PWA especializado em despachantia para CAC** que automatiza a gestÃ£o de processos complexos de:
- Carteira de Atirador (CAC)
- Porte de Arma
- Posse de Arma
- AutorizaÃ§Ã£o de Compra
- Guias de TrÃ¡fego
- RenovaÃ§Ãµes e FiscalizaÃ§Ãµes
- IntegraÃ§Ã£o com Receita Federal e ExÃ©rcito

**PÃºblico:** Despachantes profissionais que trabalham com documentaÃ§Ã£o de armamento  
**Formato:** PWA responsivo (funciona como app no celular e desktop)  
**Stack:** React + Supabase + TypeScript + Tailwind CSS

---

## ð¯ FUNCIONALIDADES PRIORITÃRIAS (MVP)

### 1. GERENCIADOR DE CLIENTES & PROCESSOS
Centraliza toda informaÃ§Ã£o do cliente em um Ãºnico lugar com:
- Cadastro de dados pessoais (CPF, RG, contato)
- Armazenamento de documentos com versionamento
- Acompanhamento de processos ativos (CAC, Porte, Posse, Compra)
- Registro de armas com datas de vencimento
- Dashboard com status de todos os processos
- HistÃ³rico completo de cada processo

### 2. GERADOR DE CHECKLISTS INTELIGENTE
Cria automaticamente checklists contextualizados:
- Checklist para CAC (Atirador, Colecionador, CaÃ§ador)
- Checklist para Porte de Arma
- Checklist para Posse de Arma
- Checklist para AutorizaÃ§Ã£o de Compra
- Cada item com descriÃ§Ã£o e documentos anexados
- MarcaÃ§Ã£o de progresso em tempo real
- VisualizaÃ§Ã£o de itens pendentes

### 3. BASE DE CONHECIMENTO ESTRUTURADA
Central de informaÃ§Ãµes sobre legislaÃ§Ã£o e processos:
- **Guias TemÃ¡ticos:** "Como obter CAC", "DiferenÃ§a POSSE vs PORTE", "Guia de TrÃ¡fego"
- **LegislaÃ§Ã£o:** Lei 10.826/2003, Decreto 11.366/2023, SINARM, Receita Federal
- **Processos & Fluxos:** Diagramas de cada tipo de solicitaÃ§Ã£o
- **FAQ Despachante:** Perguntas frequentes sobre legislaÃ§Ã£o
- **NotÃ­cias & AtualizaÃ§Ãµes:** Feed de mudanÃ§as na legislaÃ§Ã£o
- Busca por palavra-chave, filtros por categoria, glossÃ¡rio de termos

### 4. GERENCIADOR DE PRAZOS & LEMBRETES
Monitora automaticamente datas crÃ­ticas:
- CalendÃ¡rio visual com todos os prazos
- NotificaÃ§Ãµes automÃ¡ticas (30, 15, 7, 3 dias antes)
- Alertas de prazos vencidos
- HistÃ³rico de prazos cumpridos
- ExportaÃ§Ã£o para Google Calendar/Outlook

### 5. SIMULADOR & CALCULADOR DE CUSTOS/PRAZOS
Estima valores e timeframes:
- Simulador por tipo de processo (CAC, Porte, Posse, Compra)
- Estimativas de prazo e custos governamentais
- Detalhamento de cada etapa
- VariaÃ§Ãµes por regiÃ£o/RM militar
- GeraÃ§Ã£o de orÃ§amento em PDF para cliente

### 6. GERENCIADOR DE DOCUMENTOS & ARQUIVOS
Organiza e armazena documentos de forma segura:
- Upload de mÃºltiplos arquivos (PDF, imagens, Word)
- OrganizaÃ§Ã£o automÃ¡tica por cliente/processo/arma
- VisualizaÃ§Ã£o de documentos no navegador
- Versionamento com histÃ³rico
- Busca por conteÃºdo com OCR
- Tags e categorizaÃ§Ã£o
- Compartilhamento seguro com links

---

## ðï¸ ARQUITETURA TÃCNICA

### Frontend (PWA)
- **React 18** + TypeScript para componentes type-safe
- **Supabase Client** para autenticaÃ§Ã£o e realtime
- **Tailwind CSS** para design responsivo
- **React Query** para gestÃ£o de dados
- **Zustand** para state management
- **PWA** com Service Workers para offline-first
- **Vite** para build rÃ¡pido

### Backend
- **Supabase PostgreSQL** como banco de dados
- **Supabase Auth** para autenticaÃ§Ã£o
- **Supabase Storage** para armazenamento de documentos
- **Supabase Edge Functions** para APIs customizadas
- **Row Level Security (RLS)** para seguranÃ§a de dados
- **Backup automÃ¡tico** e high availability

### Banco de Dados
```
users (despachantes)
âââ id, email, name, company
âââ settings (preferÃªncias)
âââ subscription (plano)

clients (clientes dos despachantes)
âââ id, owner_id, cpf, rg, name
âââ contact, address
âââ created_at, updated_at

processes (processos por cliente)
âââ id, client_id, type (CAC/Porte/Posse/Compra)
âââ status (Rascunho/Em AnÃ¡lise/Aprovado/Indeferido)
âââ created_at, updated_at, deadline
âââ notes, comunicaÃ§Ã£o

weapons (armas registradas)
âââ id, client_id, serial, caliber, category
âââ registration_date, expiration_date
âââ documento_storage_path
âââ traffic_guide_status

documents (arquivos)
âââ id, owner_id, process_id/weapon_id
âââ filename, type, storage_path
âââ uploaded_at, version
âââ tags

checklists (templates + instÃ¢ncias)
âââ id, type, items[], created_by
âââ instances (cÃ³pias preenchidas por cliente)

deadlines (prazos monitorados)
âââ id, related_process/weapon_id, date
âââ title, priority, reminder_days
âââ completed_at

knowledge_base (artigos e guias)
âââ id, title, content, category
âââ tags, updated_at, author
âââ search_index

communications (histÃ³rico de interaÃ§Ãµes)
âââ id, client_id/process_id, type
âââ content, created_by, created_at
âââ attachments
```

---

## ð CASOS DE USO PRINCIPAIS

### Caso 1: Novo Cliente Solicitando CAC
1. Despachante acessa "Novo Cliente" â preenche dados bÃ¡sicos
2. Clica em "Novo Processo" â seleciona "Solicitar CAC (Atirador)"
3. Sistema gera automaticamente:
   - Checklist com todos os documentos necessÃ¡rios
   - Cronograma estimado (60-90 dias)
   - OrÃ§amento customizado (R$ 1.337-3.350)
   - Guia de legislaÃ§Ã£o aplicÃ¡vel
4. Despachante organiza documentaÃ§Ã£o (upload)
5. Sistema monitora prazos automaticamente
6. Cliente recebe notificaÃ§Ãµes de progresso

### Caso 2: RenovaÃ§Ã£o de CAC
1. Dashboard mostra "CAC de JoÃ£o vence em 180 dias"
2. Clica em "Iniciar RenovaÃ§Ã£o"
3. Sistema copia dados da CAC anterior
4. Gera novo checklist com mudanÃ§as necessÃ¡rias
5. Avisa quais documentos precisam ser atualizados
6. Organiza timeline para conclusÃ£o antes do vencimento

### Caso 3: Auditoria/FiscalizaÃ§Ã£o
1. Ao ser notificado de uma fiscalizaÃ§Ã£o
2. Despachante acessa dados do cliente
3. Visualiza checklist "O que levar em fiscalizaÃ§Ã£o"
4. Baixa lista imprimÃ­vel
5. Verifica legislaÃ§Ã£o atualizada
6. Organiza documentos

---

## ð ROADMAP (Fases de Desenvolvimento)

### FASE 1: MVP (4-5 semanas)
- â AutenticaÃ§Ã£o de despachante (Supabase Auth)
- â Cadastro de clientes + armas
- â GestÃ£o de processos (CRUD completo)
- â Gerador de checklists bÃ¡sico
- â Upload de documentos
- â Dashboard simples com estatÃ­sticas
- â Base de conhecimento (5-10 artigos principais)
- â PWA funcional (offline-first)

### FASE 2: ExpansÃ£o (3-4 semanas)
- â Gerenciador de prazos + lembretes
- â Calculador de custos/prazos
- â Sistema de comunicaÃ§Ã£o (notas/atividades)
- â RelatÃ³rios bÃ¡sicos (PDF)
- â Busca full-text na base de conhecimento
- â IntegraÃ§Ã£o com calendÃ¡rio
- â Notifications (email/web push)

### FASE 3: Refinamento (2-3 semanas)
- â Compartilhamento de documentos com clientes
- â Portal cliente (visualizaÃ§Ã£o de progresso)
- â NotificaÃ§Ãµes por email
- â Analytics (dashboard de performance)
- â CustomizaÃ§Ã£o de templates
- â Testes de usabilidade
- â Performance optimization

### FASE 4: IntegraÃ§Ãµes & Premium (Futuro)
- ð® IntegraÃ§Ã£o com SINARM (consultas de status)
- ð® IntegraÃ§Ã£o com Receita Federal (validaÃ§Ã£o)
- ð® Sistema de faturamento integrado
- ð® CRM avanÃ§ado com histÃ³rico de interaÃ§Ãµes
- ð® IA para sugestÃ£o de aÃ§Ãµes
- ð® VersÃ£o mobile nativa (iOS/Android)

---

## ð° MODELO DE NEGÃCIO

### OpÃ§Ãµes de MonetizaÃ§Ã£o:
1. **Subscription SaaS**
   - Plano BÃ¡sico: R$ 299/mÃªs (atÃ© 20 clientes)
   - Plano Pro: R$ 699/mÃªs (atÃ© 100 clientes)
   - Plano Enterprise: R$ 1.499/mÃªs (unlimited)

2. **ComissÃ£o por Processo**
   - 5-10% sobre valor de cada processo completado

3. **HÃ­brido**
   - Assinatura base + bÃ´nus por processos

### Diferenciais Competitivos:
- EspecializaÃ§Ã£o 100% em CAC (nÃ£o genÃ©rico como DriveDeck/Documentalista)
- Base de conhecimento jurÃ­dico sempre atualizada
- AutomaÃ§Ã£o inteligente de checklists
- Interface intuitiva e moderna
- 100% em portuguÃªs
- CustomizÃ¡vel para diferentes regiÃµes/RMs
- Totalmente offline-first

---

## ð SEGURANÃA & COMPLIANCE

- â LGPD (Lei Geral de ProteÃ§Ã£o de Dados)
- â Criptografia end-to-end para documentos
- â AutenticaÃ§Ã£o segura (Supabase Auth)
- â Row Level Security (RLS) no banco
- â Audit logs completos
- â Backup automÃ¡tico
- â PolÃ­tica de privacidade clara
- â Termos de serviÃ§o

---

## ð MÃTRICAS DE SUCESSO

```
KPIs Principais:
âââ Taxa de adoÃ§Ã£o (despachantes ativos)
âââ MÃ©dia de clientes por despachante
âââ Tempo mÃ©dio de conclusÃ£o de processo
âââ Taxa de retenÃ§Ã£o mensal
âââ NPS (Net Promoter Score)
âââ ReduÃ§Ã£o de retrabalho
âââ Aumento de receita do despachante
âââ SatisfaÃ§Ã£o com base de conhecimento
```

---

## ð¨ DESIGN & UX PRINCIPLES

- **Paleta:** Azul profissional + acentos vermelhos (urgÃªncia)
- **Tipografia:** Clara, legÃ­vel, acessÃ­vel
- **Componentes:** Modulares e reutilizÃ¡veis
- **Responsivo:** Mobile-first design
- **Acessibilidade:** WCAG 2.1 AA
- **Performance:** <3s load time
- **Fluxos:** Onboarding simples, confirmaÃ§Ãµes claras

---

## ð PRÃXIMOS PASSOS

1. **ValidaÃ§Ã£o com Despachantes** (1 semana)
   - Entrevistar 3-5 despachantes
   - Validar funcionalidades prioritÃ¡rias

2. **Design Detalhado** (1 semana)
   - Wireframes de todas as telas principais
   - Prototipagem interativa

3. **Desenvolvimento MVP** (4-5 semanas)
   - Setup da infraestrutura Supabase
   - Desenvolvimento frontend e backend
   - Testes contÃ­nuos

4. **Beta Testing** (2 semanas)
   - Teste com 5-10 despachantes reais
   - Coleta de feedback
   - Refinement

5. **Launch** 
   - Marketing para comunidade CAC
   - Suporte ao cliente
   - Monitoramento

---

**Documento versÃ£o 1.0 â Setembro 2026**  
**Status:** Pronto para desenvolvimento
