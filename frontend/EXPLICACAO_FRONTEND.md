# Explicação do Frontend (Visão Geral)

O frontend do Alego Manus é responsável por toda a interface visual e interação do usuário. Ele foi desenvolvido usando React (com TypeScript) e Vite, e utiliza bibliotecas modernas para facilitar o desenvolvimento e a experiência do usuário.

## Estrutura de Pastas do Frontend

- `src/` — Código-fonte principal do frontend
  - `components/` — Componentes reutilizáveis da interface (ex: PDFTools, botões, formulários)
  - `hooks/` — Hooks customizados do React para lógica reutilizável
  - `layout/` — Componentes de layout (ex: cabeçalho, rodapé)
  - `lib/` — Funções utilitárias e integrações externas
  - `pages/` — Páginas principais do app (ex: Home, Cursos, Materias)
  - `services/` — Funções para comunicação com a API backend
  - `styles/` — Arquivos de estilo (CSS, Tailwind)
- `public/` — Arquivos estáticos (index.html, manifest, PDFs, etc)
- `App.tsx` — Componente raiz da aplicação
- `main.tsx` — Ponto de entrada do React

## Principais Conceitos

- **Componentes**: Blocos reutilizáveis de interface (ex: PDFTools, ListaCursos)
- **Hooks**: Funções para lógica de estado e efeitos (ex: useCursos, useUpload)
- **Pages**: Cada página do app (ex: página de cursos, página de upload)
- **Services**: Funções que fazem requisições HTTP para o backend

## Fluxo de Dados

1. Usuário interage com um componente (ex: faz upload de PDF)
2. O componente chama um service (ex: uploadService)
3. O service faz uma requisição HTTP para o backend
4. O backend responde e o frontend atualiza a interface

## Dicas para Estudo

- Comece lendo o `App.tsx` para entender a estrutura principal
- Explore os componentes em `src/components/`
- Veja como os hooks são usados para buscar dados e controlar o estado
- Analise os services para entender como o frontend conversa com o backend

Se quiser explicações detalhadas de cada parte (componentes, hooks, pages, services), peça por cada uma delas!
