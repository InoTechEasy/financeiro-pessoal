# Plano de Deploy - Financeiro Pessoal

## 1. Deploy no GitHub + Render

### Passo 1: Configurar .gitignore
Criar arquivo `.gitignore` na raiz do projeto:
```
node_modules/
dist/
.env
.env.local
.DS_Store
*.log
```

### Passo 2: Configurar variáveis de ambiente
Criar arquivo `.env.example`:
```
VITE_SUPABASE_URL=sua_supabase_url
VITE_SUPABASE_ANON_KEY=sua_supabase_anon_key
```

### Passo 3: Criar repositório GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/financeiro-pessoal.git
git push -u origin main
```

### Passo 4: Configurar Render
1. Criar conta em https://render.com
2. Criar novo "Web Service"
3. Conectar ao repositório GitHub
4. Configurar:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run preview`
   - Environment Variables:
     - `VITE_SUPABASE_URL`: sua URL do Supabase
     - `VITE_SUPABASE_ANON_KEY`: sua anon key do Supabase

### Passo 5: Deploy automático
Render fará deploy automático sempre que houver push no GitHub.

## 2. Arquitetura Multi-Tenancy para Múltiplos Clientes

### Opção A: Banco de Dados Separado por Cliente (Recomendado)
Cada cliente tem seu próprio banco de dados Supabase.

**Vantagens:**
- Isolamento completo de dados
- Segurança máxima
- Backup individual
- Escalabilidade independente

**Implementação:**
1. Criar projeto Supabase para cada cliente
2. Cada cliente tem suas próprias credenciais
3. Aplicativo recebe credenciais via variáveis de ambiente ou login
4. Front-end se conecta ao banco do cliente autenticado

**Fluxo:**
- Cliente faz login
- Sistema identifica o cliente
- Front-end usa credenciais do banco daquele cliente
- Todos os dados são isolados por banco

### Opção B: Schema Separado no Mesmo Banco
Todos os clientes no mesmo banco, com schemas separados.

**Vantagens:**
- Custo menor (um banco para todos)
- Manutenção centralizada

**Desvantagens:**
- Complexidade maior
- Risco de vazamento de dados se não implementado corretamente
- Backup compartilhado

**Implementação:**
- Criar schema para cada cliente: `cliente1`, `cliente2`, etc.
- Usar Row Level Security (RLS) para isolar dados
- Adicionar coluna `tenant_id` em todas as tabelas

### Opção C: Coluna tenant_id (Multi-Tenancy Simples)
Todos os dados no mesmo banco, separados por coluna `tenant_id`.

**Vantagens:**
- Implementação mais simples
- Custo menor

**Desvantagens:**
- Risco de vazamento de dados se RLS falhar
- Performance pode ser afetada com muitos clientes

**Implementação:**
- Adicionar coluna `tenant_id` em todas as tabelas
- Configurar RLS para filtrar por `tenant_id`
- Middleware para injetar `tenant_id` nas queries

## Recomendação: Opção A (Banco Separado)

### Por que escolher Opção A?
1. **Segurança**: Isolamento total de dados
2. **Escalabilidade**: Cada cliente pode ter seu plano
3. **Backup**: Backup individual por cliente
4. **Simplicidade**: Menos complexidade técnica
5. **Venda**: Fácil de vender como SaaS independente

### Implementação Prática

#### 1. Sistema de Autenticação
- Cliente se cadastra no sistema principal
- Sistema cria projeto Supabase automaticamente via API
- Cliente recebe credenciais exclusivas
- Login redireciona para instância do cliente

#### 2. Estrutura de Arquivos
```
financeiro-pessoal/
├── src/
│   ├── services/
│   │   ├── supabaseClient.ts  (configura dinâmica)
│   │   └── authService.ts
│   └── components/
├── .env.example
└── README.md
```

#### 3. Configuração Dinâmica do Supabase
```typescript
// src/services/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

export const createSupabaseClient = (url: string, key: string) => {
  return createClient(url, key);
};
```

#### 4. Fluxo de Login
1. Usuário acessa app principal
2. Faz login/cadastro
3. Sistema busca credenciais do banco do cliente
4. Front-end inicializa Supabase com credenciais do cliente
5. Usuário acessa dados isolados

#### 5. Modelo de Negócio
- **SaaS Multi-Tenant**: Um código, múltiplos bancos
- **Preço**: Mensal por cliente
- **Plano**: Inclui banco Supabase + domínio customizado
- **Suporte**: Atendimento individual por cliente

## Próximos Passos

1. Implementar sistema de autenticação multi-cliente
2. Criar API para gerenciar projetos Supabase
3. Implementar configuração dinâmica do Supabase
4. Criar painel administrativo para gerenciar clientes
5. Implementar sistema de cobrança/assinatura
