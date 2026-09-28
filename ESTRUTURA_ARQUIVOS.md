# Estrutura de Arquivos - DESPACHANTE CAC PROF

## ð Mapeamento de Arquivos

Todos os arquivos estÃ£o salvos no scratchpad com nomes prefixados. Aqui estÃ¡ o mapeamento correto para sua estrutura de pasta:

### Raiz do Projeto
```
despachante-cac-prof/
âââ package.json                    â copiar src-package.json (sem renomear)
âââ vite.config.ts                  â copiar src-vite.config.ts (sem renomear)
âââ tsconfig.json                   â copiar arquivo
âââ tsconfig.node.json              â criar cÃ³pia de tsconfig.json
âââ tailwind.config.js              â copiar arquivo
âââ postcss.config.js               â copiar arquivo
âââ .env.local                       â criar de .env.example
âââ .gitignore                       â criar (veja abaixo)
âââ index.html                       â copiar arquivo
âââ README.md                        â criar (documentaÃ§Ã£o)
âââ GUIA_IMPLEMENTACAO.md            â copiar arquivo
âââ ESTRUTURA_ARQUIVOS.md            â este arquivo
âââ setup_database.sql               â USAR NO SUPABASE (nÃ£o copiar para src)
âââ node_modules/                    â criado por npm install
âââ dist/                            â criado por npm run build
âââ src/
    âââ main.tsx                     â renomear de src-main.tsx
    âââ App.tsx                      â renomear de src-App.tsx
    âââ index.css                    â renomear de src-index.css
    âââ supabase.ts                  â renomear de src-supabase.ts
    âââ vite-env.d.ts                â criar (arquivo vazio ou com tipos)
    âââ components/
    â   âââ Button.tsx               â renomear de src-components-Button.tsx
    â   âââ Card.tsx                 â renomear de src-components-Card.tsx
    â   âââ Input.tsx                â renomear de src-components-Input.tsx
    â   âââ Modal.tsx                â renomear de src-components-Modal.tsx
    â   âââ index.ts                 â renomear de src-components-index.ts
    âââ pages/
    â   âââ Login.tsx                â renomear de src-pages-Login.tsx
    â   âââ Dashboard.tsx             â renomear de src-pages-Dashboard.tsx
    âââ store/
    â   âââ auth.ts                  â renomear de src-store-auth.ts
    âââ hooks/
    â   âââ (criarÃ¡ conforme necessÃ¡rio)
    âââ utils/
    â   âââ (criarÃ¡ conforme necessÃ¡rio)
    âââ types/
        âââ (criarÃ¡ conforme necessÃ¡rio)
```

---

## ð Passo a Passo - Copiar Arquivos

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

### 3. Copiar arquivos de configuraÃ§Ã£o (raiz)
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
(Ele jÃ¡ contÃ©m as credenciais corretas)

### 5. Copiar arquivos src/ (com renomeaÃ§Ã£o)
```bash
# src-main.tsx â src/main.tsx
# src-App.tsx â src/App.tsx
# src-index.css â src/index.css
# src-supabase.ts â src/supabase.ts
```

### 6. Copiar componentes
```bash
# src-components-Button.tsx â src/components/Button.tsx
# src-components-Card.tsx â src/components/Card.tsx
# src-components-Input.tsx â src/components/Input.tsx
# src-components-Modal.tsx â src/components/Modal.tsx
# src-components-index.ts â src/components/index.ts
```

### 7. Copiar pÃ¡ginas
```bash
# src-pages-Login.tsx â src/pages/Login.tsx
# src-pages-Dashboard.tsx â src/pages/Dashboard.tsx
```

### 8. Copiar store
```bash
# src-store-auth.ts â src/store/auth.ts
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

## ð¦ Setup Database SQL

**â ï¸ IMPORTANTE:** `setup_database.sql` **NÃO** vai na pasta src!

Este arquivo deve ser:
1. Mantido em um local seguro (versÃ£o controle, etc)
2. Executado **APENAS** no SQL Editor do Supabase
3. NÃ£o serÃ¡ usado pelo cÃ³digo React diretamente

---

## ð Arquivos Relacionados no Projeto

| Arquivo | PropÃ³sito | Quando usar |
|---------|-----------|------------|
| setup_database.sql | Criar tabelas no Supabase | 1 vez, no inicio |
| .env.local | ConfiguraÃ§Ã£o local | Sempre (nÃ£o commitar) |
| package.json | DependÃªncias npm | InstalaÃ§Ã£o inicial |
| vite.config.ts | ConfiguraÃ§Ã£o build | Desenvolvimento |
| tailwind.config.js | Estilos Tailwind | CustomizaÃ§Ã£o CSS |
| tsconfig.json | ConfiguraÃ§Ã£o TypeScript | CompilaÃ§Ã£o |
| index.html | Template HTML | Ponto entrada |
| src/main.tsx | Entry point React | InicializaÃ§Ã£o |
| src/App.tsx | Rotas e layout | Estrutura app |

---

## â VerificaÃ§Ã£o Final

ApÃ³s copiar todos os arquivos:

1. **Verifique estrutura:**
   ```bash
   tree -L 2 src/
   # Deve mostrar: components/, pages/, store/, App.tsx, main.tsx, etc
   ```

2. **Instale dependÃªncias:**
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

## ð Estrutura Completa (ApÃ³s Setup)

```
despachante-cac-prof/
âââ .git/                           (se usar git)
âââ .gitignore
âââ .env.local                      (â ï¸ NÃO commitar)
âââ node_modules/
âââ dist/                           (apÃ³s npm run build)
âââ src/
â   âââ components/
â   â   âââ Button.tsx
â   â   âââ Card.tsx
â   â   âââ Input.tsx
â   â   âââ Modal.tsx
â   â   âââ index.ts
â   âââ pages/
â   â   âââ Login.tsx
â   â   âââ Dashboard.tsx
â   âââ store/
â   â   âââ auth.ts
â   âââ hooks/
â   âââ utils/
â   âââ types/
â   âââ App.tsx
â   âââ main.tsx
â   âââ index.css
â   âââ supabase.ts
â   âââ vite-env.d.ts
âââ public/
âââ index.html
âââ package.json
âââ package-lock.json
âââ vite.config.ts
âââ tsconfig.json
âââ tsconfig.node.json
âââ tailwind.config.js
âââ postcss.config.js
âââ GUIA_IMPLEMENTACAO.md
âââ ESTRUTURA_ARQUIVOS.md
âââ README.md
âââ setup_database.sql              (manter seguro, NÃO em src/)
```

---

## ð Comando RÃ¡pido (Copiar/Colar)

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

## ð¯ PrÃ³ximo Passo

Depois de copiar tudo, execute:
```bash
npm run dev
```

VocÃª verÃ¡:
```
VITE v5.x.x  ready in xxx ms

â  Local:   http://localhost:3000/
â  press h to show help
```

Abra http://localhost:3000 no navegador e veja o login aparecer! â
