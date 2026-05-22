# Financeiro Pessoal

Aplicativo web completo para gestão financeira pessoal desenvolvido com React, TypeScript, Supabase e Tailwind CSS.

## 🚀 Tecnologias

- **React 18** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool e dev server
- **Supabase** - Backend como serviço (banco de dados, autenticação)
- **Tailwind CSS** - Framework CSS utilitário
- **React Router DOM** - Roteamento de aplicação
- **Recharts** - Biblioteca para gráficos
- **date-fns** - Manipulação de datas
- **react-hook-form** - Gerenciamento de formulários
- **zod** - Validação de schemas

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no [Supabase](https://supabase.com/)
- Git instalado (para versionamento)

## 🛠️ Configuração do Projeto

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Crie um novo projeto no [Supabase](https://supabase.com/)
2. Vá em Settings > API e copie:
   - Project URL
   - anon public key
3. Execute o script SQL em `database/schema.sql` no SQL Editor do Supabase
4. Configure o Google OAuth em Authentication > Providers (opcional)

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

### 4. Executar o Projeto

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── Dashboard.tsx
│   ├── Lancamentos/
│   │   ├── ListaLancamentos.tsx
│   │   ├── FormularioLancamento.tsx
│   │   ├── FiltrosLancamentos.tsx
│   │   └── ModalLancamento.tsx
│   ├── Gestao/
│   │   ├── GerenciadorReceitas.tsx
│   │   ├── GerenciadorInvestimentos.tsx
│   │   ├── GerenciadorCategoriasDespesas.tsx
│   │   ├── GerenciadorBancos.tsx
│   │   ├── GerenciadorCartoes.tsx
│   │   ├── GerenciadorFornecedores.tsx
│   │   └── GerenciadorDocumentos.tsx
│   ├── Comum/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   ├── Loading.tsx
│   │   └── ErrorBoundary.tsx
│   └── Auth/
│       ├── Login.tsx
│       └── Register.tsx
├── pages/
│   ├── Financeiro.tsx
│   ├── Gestao.tsx
│   ├── Login.tsx
│   └── NotFound.tsx
├── services/
│   ├── supabaseClient.ts
│   ├── lancamentosService.ts
│   ├── receitasService.ts
│   ├── investimentosService.ts
│   ├── categoriasService.ts
│   ├── bancosService.ts
│   ├── cartoesService.ts
│   ├── fornecedoresService.ts
│   └── documentosService.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useLancamentos.ts
│   ├── useReceitas.ts
│   ├── useInvestimentos.ts
│   ├── useCategorias.ts
│   └── useBancos.ts
├── types/
│   └── index.ts
├── utils/
│   ├── formatters.ts
│   ├── validators.ts
│   └── helpers.ts
├── styles/
│   └── globals.css
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

## 🎯 Funcionalidades

### MVP (Fase 1) - COMPLETO
- ✅ Autenticação (Login/Registro)
- ✅ Dashboard com resumo financeiro
- ✅ CRUD de lançamentos
- ✅ Filtros básicos
- ✅ Estrutura de serviços e hooks

### Fase 2 - COMPLETO
- ✅ Gestão de categorias (hierárquica)
- ✅ Gestão de receitas
- ✅ Gestão de investimentos
- ✅ Gestão de bancos
- ✅ Gestão de cartões de crédito
- ✅ Gestão de fornecedores
- ✅ Gestão de tipos de documentos

### Fase 3 - COMPLETO
- ✅ Dashboard financeiro com resumo
- ✅ Relatórios em PDF
- ✅ Filtros por período

### Fase 4
- ⏳ Temas (dark mode)
- ⏳ Exportação de dados (CSV/Excel)
- ⏳ Refinamentos de UX

## 🚀 Deploy no Render

### 1. Preparar para Deploy

```bash
npm run build
```

### 2. Configurar no Render usando render.yaml

O projeto já possui um arquivo `render.yaml` com a configuração automática. Para fazer o deploy:

1. Crie uma conta no [Render](https://render.com/)
2. Conecte seu repositório GitHub
3. Render detectará automaticamente o arquivo `render.yaml` e configurará:
   - Build command: `npm run build`
   - Static site: pasta `dist`
   - Variáveis de ambiente (já configuradas no render.yaml)
4. Clique em "Deploy" para iniciar o processo

### 3. Variáveis de Ambiente

As variáveis de ambiente já estão configuradas no `render.yaml`, mas você pode alterá-las no painel do Render se necessário:
- `VITE_SUPABASE_URL`: https://lbghddgwuiaskybajcyl.supabase.co
- `VITE_SUPABASE_ANON_KEY`: sb_publishable_KvmQ9HcoibUY7uTy_4ihBA_zN0r0qKc

### 4. Deploy automático

O Render fará deploy automático em cada push para a branch principal configurada.

## 📦 GitHub

### 1. Criar Repositório

```bash
git init
git add .
git commit -m "Initial commit"
```

2. Crie um repositório no GitHub
3. Conecte o repositório local:

```bash
git remote add origin https://github.com/seu-usuario/financeiro-pessoal.git
git branch -M main
git push -u origin main
```

## 🔐 Segurança

- Nunca commitar o arquivo `.env.local`
- Usar variáveis de ambiente para dados sensíveis
- Habilitar RLS (Row Level Security) no Supabase
- Validar todos os dados no frontend e backend

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👤 Autor

Leonardo

## 🙮 Agradecimentos

- Supabase pelo backend como serviço
- Comunidade React e TypeScript
- Tailwind CSS pelo framework CSS
