# 📚 GUIA DE ESTUDOS - Arquitetura do Alego Manus

## 🎯 **Como o Projeto Funciona (Visão Geral)**

### 📁 **Estrutura do Projeto**
```
Alego-manus/
├── 🎨 frontend/          # Interface do usuário (React + TypeScript)
│   ├── src/
│   │   ├── components/   # Componentes reutilizáveis
│   │   ├── hooks/        # Lógica personalizada compartilhada
│   │   ├── pages/        # Páginas da aplicação
│   │   └── services/     # Comunicação com API
│   └── dist/            # Versão "compilada" para produção
│
└── 🔧 backend/          # Servidor da aplicação (Python + Flask)
    ├── models/          # Estrutura do banco de dados
    ├── routes/          # Endpoints da API
    └── instance/        # Banco de dados SQLite
```

---

## 🧠 **Conceitos Fundamentais**

### 1. **Frontend (O que o usuário vê)**
- **React**: Biblioteca para criar interfaces interativas
- **TypeScript**: JavaScript com tipos (mais seguro)
- **Vite**: Ferramenta que "empacota" o código para produção
- **Tailwind CSS**: Framework para estilização rápida

### 2. **Backend (O "cérebro" da aplicação)**
- **Flask**: Framework web em Python (como Express.js do Node)
- **SQLite**: Banco de dados leve (arquivo local)
- **APIs REST**: Endpoints que frontend chama (GET, POST, etc.)

### 3. **Comunicação Frontend ↔ Backend**
```
📱 Frontend         🌐 Internet         🖥️ Backend
   ↓                    ↓                   ↓
[Botão clicado] → [fetch('/api/cursos')] → [Flask processa]
   ↑                    ↑                   ↓
[Interface atualiza] ← [JSON response] ← [Retorna dados]
```

---

## 📝 **Principais Componentes Explicados**

### 🔊 **Text-to-Speech (useTextToSpeech.ts)**
```typescript
// CONCEITO: Hook personalizado = função que reutiliza lógica
const { speak, stop, isSpeaking } = useTextToSpeech({
  lang: 'pt-BR',     // Idioma português
  rate: 0.9          // Velocidade da fala
});

// Como funciona:
// 1. Browser tem API nativa speechSynthesis
// 2. Hook verifica se está disponível
// 3. Configura voz, velocidade, idioma
// 4. Retorna funções para usar em qualquer componente
```

### 📝 **PDFNotes (Sistema de Anotações)**
```typescript
// CONCEITO: Estado local + persistência no servidor

const [notes, setNotes] = useState([]);  // Array de anotações
const [showBalloon, setShowBalloon] = useState(false);  // Controla visibilidade

// Fluxo:
// 1. Usuário digita → setState atualiza 'input'
// 2. Clica salvar → fetch POST envia para backend
// 3. Backend salva no SQLite
// 4. Frontend atualiza lista local
```

### 📄 **MarkdownViewer (Renderizador)**
```typescript
// CONCEITO: Conversão de texto simples para HTML formatado

// Markdown:     **negrito** e *itálico*
// Vira HTML:    <strong>negrito</strong> e <em>itálico</em>

// ReactMarkdown faz essa conversão automaticamente
<ReactMarkdown remarkPlugins={[remarkGfm]}>
  {conteudo}  {/* Texto markdown */}
</ReactMarkdown>
```

---

## 🔄 **Ciclo de Vida de uma Requisição**

### Exemplo: Carregando anotações
```
1. 📱 Componente monta
   ↓
2. 🔄 useEffect dispara
   ↓
3. 🌐 fetch('/api/anotacoes/123')
   ↓
4. 🖥️ Flask recebe requisição
   ↓
5. 🗄️ Consulta SQLite
   ↓
6. 📤 Retorna JSON
   ↓
7. 📱 Frontend atualiza estado
   ↓
8. 🎨 Interface re-renderiza
```

---

## 🛠️ **Ferramentas de Desenvolvimento**

### **VS Code + Extensões Essenciais**
- **ES7+ React/Redux/React-Native snippets**: Atalhos para React
- **TypeScript Importer**: Auto-importa tipos
- **Tailwind CSS IntelliSense**: Autocomplete CSS
- **Python**: Suporte completo para Flask

### **Comandos Úteis**
```bash
# Frontend
npm run dev          # Servidor desenvolvimento
npm run build        # Build produção
npm install pacote   # Instalar dependência

# Backend  
python app.py        # Rodar servidor
pip install pacote   # Instalar dependência
```

---

## 📚 **Próximos Estudos Recomendados**

### **Iniciante → Intermediário**
1. **JavaScript ES6+**: async/await, destructuring, arrow functions
2. **React Hooks**: useState, useEffect, useContext
3. **TypeScript Básico**: interfaces, types, generics
4. **HTTP/APIs**: REST, JSON, status codes

### **Intermediário → Avançado**
1. **State Management**: Context API, Redux
2. **Testing**: Jest, React Testing Library
3. **Performance**: React.memo, useMemo, useCallback
4. **Build Tools**: Webpack, Vite configuration

### **Backend (Python)**
1. **Flask Avançado**: Blueprints, middlewares
2. **SQLAlchemy**: ORM, relationships, migrations
3. **Authentication**: JWT, sessions
4. **Deploy**: Docker, CI/CD

---

## 🎯 **Exercícios Práticos**

### **Nível 1: Modificações Simples**
- [ ] Mudar cor dos botões no PDFNotes
- [ ] Adicionar novo campo nas anotações (ex: categoria)
- [ ] Modificar velocidade padrão do Text-to-Speech

### **Nível 2: Novas Funcionalidades**
- [ ] Adicionar busca nas anotações
- [ ] Criar botão para exportar anotações como PDF
- [ ] Implementar modo escuro/claro

### **Nível 3: Arquitetura**
- [ ] Criar novo endpoint na API
- [ ] Implementar autenticação de usuário
- [ ] Adicionar testes automatizados

---

**💡 Dica**: Sempre comece pelo problema que quer resolver, depois pesquise a tecnologia. "Como fazer X?" é melhor que "Para que serve Y?"

**🚀 Você já tem uma base sólida! Continue praticando e experimentando!**
