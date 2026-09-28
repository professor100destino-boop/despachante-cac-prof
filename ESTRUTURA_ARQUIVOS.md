# Estrutura de Arquivos - DESPACHANTE CAC PROF

## 📁 Mapeamento de Arquivos

Todos os arquivos estão salvos no scratchpad com nomes prefixados. Aqui está o mapeamento correto para sua estrutura de pasta:

### Raiz do Projeto
```
despachante-cac-prof/
├── package.json                    ← copiar src-package.json (sem renomear)
├── vite.config.ts                  ← copiar src-vite.config.ts (sem renomear)
├── tsconfig.json                   ← copiar arquivo
├── tsconfig.node.json              ← criar cópia de tsconfig.json
├── tailwind.config.js              ← copiar arquivo
├── postcss.config.js               ← copiar arquivo
├── .env.local                       ← criar de .env.example
├── .gitignore                       ← criar (veja abaixo)
├── index.html                       ← copiar arquivo
├── README.md                        ← criar (documentação)
├── GUIA_IMPLEMENTACAO.md            ← copiar arquivo
├── ESTRUTURA_ARQUIVOS.md            ← este arquivo
├── setup_database.sql               ← USAR NO SUPABASE (não copiar para src)
├── node_modules/                    ← criado por npm install
├── dist/                            ← criado por npm run build
└── src/
    ├── main.tsx                     ← renomear de src-main.tsx
    ├── App.tsx                      ← renomear de src-App.tsx
    ├── index.css                    ← renomear de src-index.css
    ├── supabase.ts                  ← renomear de src-supabase.ts
    ├── vite-env.d.ts                ← criar (arquivo vazio ou com tipos)
    ├── components/
    │   ├── Button.tsx               ← renomear de src-components-Button.tsx
    │   ├── Card.tsx                 ← renomear de src-components-Card.tsx
    │   ├── Input.tsx                ← renomear de src-components-Input.tsx
    │   ├── Modal.tsx                ← renomear de src-components-Modal.tsx
    │   └── index.ts                 ← renomear de src-components-index.ts
    ├── pages/
    │   ├── Login.tsx                ← renomear de src-pages-Login.tsx
    │   └── Dashboard.tsx             ← renomear de src-pages-Dashboard.tsx
    ├── store/
    │   └── auth.ts                  ← renomear de src-store-auth.ts
    ├── hooks/
    │   └── (criará conforme necessário)
    ├── utils/
    │   └── (criará conforme necessário)
    └── types/
        └── (criará conforme necessário)
```

---

## 🔄 Passo a Passo - Copiar Arquivos

### 1. Criar pasta raiz
```bash
mkdir despachante-cac-prof
cd despachante-cac-prof
```

### 2. Criar estrutura de pastas
```bash
mkdir -p src/components src/pages src/store src/hooks src/utils src/types
mkdir -p public
```

### 3. Copiar arquivos de configuração (raiz)
```bash
# Copie estes arquivos para a raiz:
- package.json
- vite.config.ts
- tsconfig.json
- tailwind.config.js
- postcss.config.js
- index.html
- GUIA_IMPLEMENTACAO.md
- ESTRUTURA_ARQUIVOS.md
```

### 4. Criar .env.local
Copie `.env.example` e renomeie para `.env.local`
(Ele já contém as credenciais corretas)

### 5. Copiar arquivos src/ (com renomeação)
```bash
# src-main.tsx → src/main.tsx
# src-App.tsx → src/App.tsx
# src-index.css → src/index.css
# src-supabase.ts → src/supabase.ts
```

### 6. Copiar componentes
```bash
# src-components-Button.tsx → src/components/Button.tsx
# src-components-Card.tsx → src/components/Card.tsx
# src-components-Input.tsx → src/components/Input.tsx
# src-components-Modal.tsx → src/components/Modal.tsx
# src-components-index.ts → src/components/index.ts
```

### 7. Copiar páginas
```bash
# src-pages-Login.tsx → src/pages/Login.tsx
# src-pages-Dashboard.tsx → src/pages/Dashboard.tsx
```

### 8. Copiar store
```bash
# src-store-auth.ts → src/store/auth.ts
```

### 9. Criar arquivos vazios/boilerplate

**tsconfig.node.json:**
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

**.gitignore:**
```
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Build
dist/
.dist

# Environment
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/
.nyc_output/

# PWA
/public/sw.js
/public/workbox-*.js
```

**src/vite-env.d.ts:**
```typescript
/// <reference types="vite/client" />
```

---

## 📦 Setup Database SQL

**⚠️ IMPORTANTE:** `setup_database.sql` **NÃO** vai na pasta src!

Este arquivo deve ser:
1. Mantido em um local seguro (versão controle, etc)
2. Executado **APENAS** no SQL Editor do Supabase
3. Não será usado pelo código React diretamente

---

## 🔗 Arquivos Relacionados no Projeto

| Arquivo | Propósito | Quando usar |
|---------|-----------|------------|
| setup_database.sql | Criar tabelas no Supabase | 1 vez, no inicio |
| .env.local | Configuração local | Sempre (não commitar) |
| package.json | Dependências npm | Instalação inicial |
| vite.config.ts | Configuração build | Desenvolvimento |
| tailwind.config.js | Estilos Tailwind | Customização CSS |
| tsconfig.json | Configuração TypeScript | Compilação |
| index.html | Template HTML | Ponto entrada |
| src/main.tsx | Entry point React | Inicialização |
| src/App.tsx | Rotas e layout | Estrutura app |

---

## ✅ Verificação Final

Após copiar todos os arquivos:

1. **Verifique estrutura:**
   ```bash
   tree -L 2 src/
   # Deve mostrar: components/, pages/, store/, App.tsx, main.tsx, etc
   ```

2. **Instale dependências:**
   ```bash
   npm install
   ```

3. **Teste build:**
   ```bash
   npm run build
   # Deve criar pasta dist/ sem erros
   ```

4. **Inicie dev:**
   ```bash
   npm run dev
   # Deve abrir http://localhost:3000
   ```

5. **Teste login:**
   - Clique "Criar Nova Conta"
   - Preencha dados
   - Clique criar
   - Deve ir para dashboard

---

## 🚀 Estrutura Completa (Após Setup)

```
despachante-cac-prof/
├── .git/                           (se usar git)
├── .gitignore
├── .env.local                      (⚠️ NÃO commitar)
├── node_modules/
├── dist/                           (após npm run build)
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── index.ts
│   ├── pages/
│   │   ├── Login.tsx
│   │   └── Dashboard.tsx
│   ├── store/
│   │   └── auth.ts
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── supabase.ts
│   └── vite-env.d.ts
├── public/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.js
├── postcss.config.js
├── GUIA_IMPLEMENTACAO.md
├── ESTRUTURA_ARQUIVOS.md
├── README.md
└── setup_database.sql              (manter seguro, NÃO em src/)
```

---

## 📋 Comando Rápido (Copiar/Colar)

Se quiser copiar tudo de uma vez (assumindo Linux/Mac):

```bash
# Crie a estrutura
mkdir -p despachante-cac-prof/{src/{components,pages,store,hooks,utils,types},public}
cd despachante-cac-prof

# Copie os arquivos principais
cp /caminho/para/scratchpad/package.json .
cp /caminho/para/scratchpad/vite.config.ts .
cp /caminho/para/scratchpad/tsconfig.json .
cp /caminho/para/scratchpad/tailwind.config.js .
cp /caminho/para/scratchpad/postcss.config.js .
cp /caminho/para/scratchpad/index.html .
cp /caminho/para/scratchpad/.env.example .env.local

# Copie src/
cp /caminho/para/scratchpad/src-main.tsx src/main.tsx
cp /caminho/para/scratchpad/src-App.tsx src/App.tsx
cp /caminho/para/scratchpad/src-index.css src/index.css
cp /caminho/para/scratchpad/src-supabase.ts src/supabase.ts

# Copie components/
cp /caminho/para/scratchpad/src-components-*.tsx src/components/
mv src/components/src-components-Button.tsx src/components/Button.tsx
# ... etc (renomear cada arquivo removendo "src-components-" e "src-")

# Instale
npm install

# Rode
npm run dev
```

---

## 🎯 Próximo Passo

Depois de copiar tudo, execute:
```bash
npm run dev
```

Você verá:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  press h to show help
```

Abra http://localhost:3000 no navegador e veja o login aparecer! ✅
