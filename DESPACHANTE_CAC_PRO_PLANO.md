# DESPACHANTE CAC PRO — Plano de Projeto

## 📋 VISÃO GERAL

Um **PWA especializado em despachantia para CAC** que automatiza a gestão de processos complexos de:
- Carteira de Atirador (CAC)
- Porte de Arma
- Posse de Arma
- Autorização de Compra
- Guias de Tráfego
- Renovações e Fiscalizações
- Integração com Receita Federal e Exército

**Público:** Despachantes profissionais que trabalham com documentação de armamento  
**Formato:** PWA responsivo (funciona como app no celular e desktop)  
**Stack:** React + Supabase + TypeScript + Tailwind CSS

---

## 🎯 FUNCIONALIDADES PRIORITÁRIAS (MVP)

### 1. GERENCIADOR DE CLIENTES & PROCESSOS
Centraliza toda informação do cliente em um único lugar com:
- Cadastro de dados pessoais (CPF, RG, contato)
- Armazenamento de documentos com versionamento
- Acompanhamento de processos ativos (CAC, Porte, Posse, Compra)
- Registro de armas com datas de vencimento
- Dashboard com status de todos os processos
- Histórico completo de cada processo

### 2. GERADOR DE CHECKLISTS INTELIGENTE
Cria automaticamente checklists contextualizados:
- Checklist para CAC (Atirador, Colecionador, Caçador)
- Checklist para Porte de Arma
- Checklist para Posse de Arma
- Checklist para Autorização de Compra
- Cada item com descrição e documentos anexados
- Marcação de progresso em tempo real
- Visualização de itens pendentes

### 3. BASE DE CONHECIMENTO ESTRUTURADA
Central de informações sobre legislação e processos:
- **Guias Temáticos:** "Como obter CAC", "Diferença POSSE vs PORTE", "Guia de Tráfego"
- **Legislação:** Lei 10.826/2003, Decreto 11.366/2023, SINARM, Receita Federal
- **Processos & Fluxos:** Diagramas de cada tipo de solicitação
- **FAQ Despachante:** Perguntas frequentes sobre legislação
- **Notícias & Atualizações:** Feed de mudanças na legislação
- Busca por palavra-chave, filtros por categoria, glossário de termos

### 4. GERENCIADOR DE PRAZOS & LEMBRETES
Monitora automaticamente datas críticas:
- Calendário visual com todos os prazos
- Notificações automáticas (30, 15, 7, 3 dias antes)
- Alertas de prazos vencidos
- Histórico de prazos cumpridos
- Exportação para Google Calendar/Outlook

### 5. SIMULADOR & CALCULADOR DE CUSTOS/PRAZOS
Estima valores e timeframes:
- Simulador por tipo de processo (CAC, Porte, Posse, Compra)
- Estimativas de prazo e custos governamentais
- Detalhamento de cada etapa
- Variações por região/RM militar
- Geração de orçamento em PDF para cliente

### 6. GERENCIADOR DE DOCUMENTOS & ARQUIVOS
Organiza e armazena documentos de forma segura:
- Upload de múltiplos arquivos (PDF, imagens, Word)
- Organização automática por cliente/processo/arma
- Visualização de documentos no navegador
- Versionamento com histórico
- Busca por conteúdo com OCR
- Tags e categorização
- Compartilhamento seguro com links

---

## 🏗️ ARQUITETURA TÉCNICA

### Frontend (PWA)
- **React 18** + TypeScript para componentes type-safe
- **Supabase Client** para autenticação e realtime
- **Tailwind CSS** para design responsivo
- **React Query** para gestão de dados
- **Zustand** para state management
- **PWA** com Service Workers para offline-first
- **Vite** para build rápido

### Backend
- **Supabase PostgreSQL** como banco de dados
- **Supabase Auth** para autenticação
- **Supabase Storage** para armazenamento de documentos
- **Supabase Edge Functions** para APIs customizadas
- **Row Level Security (RLS)** para segurança de dados
- **Backup automático** e high availability

### Banco de Dados
```
users (despachantes)
├── id, email, name, company
├── settings (preferências)
└── subscription (plano)

clients (clientes dos despachantes)
├── id, owner_id, cpf, rg, name
├── contact, address
└── created_at, updated_at

processes (processos por cliente)
├── id, client_id, type (CAC/Porte/Posse/Compra)
├── status (Rascunho/Em Análise/Aprovado/Indeferido)
├── created_at, updated_at, deadline
└── notes, comunicação

weapons (armas registradas)
├── id, client_id, serial, caliber, category
├── registration_date, expiration_date
├── documento_storage_path
└── traffic_guide_status

documents (arquivos)
├── id, owner_id, process_id/weapon_id
├── filename, type, storage_path
├── uploaded_at, version
└── tags

checklists (templates + instâncias)
├── id, type, items[], created_by
└── instances (cópias preenchidas por cliente)

deadlines (prazos monitorados)
├── id, related_process/weapon_id, date
├── title, priority, reminder_days
└── completed_at

knowledge_base (artigos e guias)
├── id, title, content, category
├── tags, updated_at, author
└── search_index

communications (histórico de interações)
├── id, client_id/process_id, type
├── content, created_by, created_at
└── attachments
```

---

## 📊 CASOS DE USO PRINCIPAIS

### Caso 1: Novo Cliente Solicitando CAC
1. Despachante acessa "Novo Cliente" → preenche dados básicos
2. Clica em "Novo Processo" → seleciona "Solicitar CAC (Atirador)"
3. Sistema gera automaticamente:
   - Checklist com todos os documentos necessários
   - Cronograma estimado (60-90 dias)
   - Orçamento customizado (R$ 1.337-3.350)
   - Guia de legislação aplicável
4. Despachante organiza documentação (upload)
5. Sistema monitora prazos automaticamente
6. Cliente recebe notificações de progresso

### Caso 2: Renovação de CAC
1. Dashboard mostra "CAC de João vence em 180 dias"
2. Clica em "Iniciar Renovação"
3. Sistema copia dados da CAC anterior
4. Gera novo checklist com mudanças necessárias
5. Avisa quais documentos precisam ser atualizados
6. Organiza timeline para conclusão antes do vencimento

### Caso 3: Auditoria/Fiscalização
1. Ao ser notificado de uma fiscalização
2. Despachante acessa dados do cliente
3. Visualiza checklist "O que levar em fiscalização"
4. Baixa lista imprimível
5. Verifica legislação atualizada
6. Organiza documentos

---

## 🚀 ROADMAP (Fases de Desenvolvimento)

### FASE 1: MVP (4-5 semanas)
- ✅ Autenticação de despachante (Supabase Auth)
- ✅ Cadastro de clientes + armas
- ✅ Gestão de processos (CRUD completo)
- ✅ Gerador de checklists básico
- ✅ Upload de documentos
- ✅ Dashboard simples com estatísticas
- ✅ Base de conhecimento (5-10 artigos principais)
- ✅ PWA funcional (offline-first)

### FASE 2: Expansão (3-4 semanas)
- ✅ Gerenciador de prazos + lembretes
- ✅ Calculador de custos/prazos
- ✅ Sistema de comunicação (notas/atividades)
- ✅ Relatórios básicos (PDF)
- ✅ Busca full-text na base de conhecimento
- ✅ Integração com calendário
- ✅ Notifications (email/web push)

### FASE 3: Refinamento (2-3 semanas)
- ✅ Compartilhamento de documentos com clientes
- ✅ Portal cliente (visualização de progresso)
- ✅ Notificações por email
- ✅ Analytics (dashboard de performance)
- ✅ Customização de templates
- ✅ Testes de usabilidade
- ✅ Performance optimization

### FASE 4: Integrações & Premium (Futuro)
- 🔮 Integração com SINARM (consultas de status)
- 🔮 Integração com Receita Federal (validação)
- 🔮 Sistema de faturamento integrado
- 🔮 CRM avançado com histórico de interações
- 🔮 IA para sugestão de ações
- 🔮 Versão mobile nativa (iOS/Android)

---

## 💰 MODELO DE NEGÓCIO

### Opções de Monetização:
1. **Subscription SaaS**
   - Plano Básico: R$ 299/mês (até 20 clientes)
   - Plano Pro: R$ 699/mês (até 100 clientes)
   - Plano Enterprise: R$ 1.499/mês (unlimited)

2. **Comissão por Processo**
   - 5-10% sobre valor de cada processo completado

3. **Híbrido**
   - Assinatura base + bônus por processos

### Diferenciais Competitivos:
- Especialização 100% em CAC (não genérico como DriveDeck/Documentalista)
- Base de conhecimento jurídico sempre atualizada
- Automação inteligente de checklists
- Interface intuitiva e moderna
- 100% em português
- Customizável para diferentes regiões/RMs
- Totalmente offline-first

---

## 🔒 SEGURANÇA & COMPLIANCE

- ✅ LGPD (Lei Geral de Proteção de Dados)
- ✅ Criptografia end-to-end para documentos
- ✅ Autenticação segura (Supabase Auth)
- ✅ Row Level Security (RLS) no banco
- ✅ Audit logs completos
- ✅ Backup automático
- ✅ Política de privacidade clara
- ✅ Termos de serviço

---

## 📈 MÉTRICAS DE SUCESSO

```
KPIs Principais:
├── Taxa de adoção (despachantes ativos)
├── Média de clientes por despachante
├── Tempo médio de conclusão de processo
├── Taxa de retenção mensal
├── NPS (Net Promoter Score)
├── Redução de retrabalho
├── Aumento de receita do despachante
└── Satisfação com base de conhecimento
```

---

## 🎨 DESIGN & UX PRINCIPLES

- **Paleta:** Azul profissional + acentos vermelhos (urgência)
- **Tipografia:** Clara, legível, acessível
- **Componentes:** Modulares e reutilizáveis
- **Responsivo:** Mobile-first design
- **Acessibilidade:** WCAG 2.1 AA
- **Performance:** <3s load time
- **Fluxos:** Onboarding simples, confirmações claras

---

## 📞 PRÓXIMOS PASSOS

1. **Validação com Despachantes** (1 semana)
   - Entrevistar 3-5 despachantes
   - Validar funcionalidades prioritárias

2. **Design Detalhado** (1 semana)
   - Wireframes de todas as telas principais
   - Prototipagem interativa

3. **Desenvolvimento MVP** (4-5 semanas)
   - Setup da infraestrutura Supabase
   - Desenvolvimento frontend e backend
   - Testes contínuos

4. **Beta Testing** (2 semanas)
   - Teste com 5-10 despachantes reais
   - Coleta de feedback
   - Refinement

5. **Launch** 
   - Marketing para comunidade CAC
   - Suporte ao cliente
   - Monitoramento

---

**Documento versão 1.0 — Setembro 2026**  
**Status:** Pronto para desenvolvimento
