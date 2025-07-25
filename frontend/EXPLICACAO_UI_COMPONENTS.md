# Diferença entre UI e Components

No frontend moderno, especialmente com React, os termos UI (User Interface) e Components são usados para organizar a interface do usuário.

## Components (Componentes)

- São blocos reutilizáveis de interface
- Podem ser botões, formulários, listas, cards, etc.
- Ficam em `src/components/`
- Exemplo: `<PDFTools />`, `<ListaCursos />`

## UI (User Interface)

- Refere-se ao conjunto completo da interface visual
- Pode ser uma pasta com componentes "primitivos" (ex: Button, Input, Modal)
- Às vezes, projetos separam `components/` (componentes de negócio) de `ui/` (componentes visuais básicos)
- Nem todo projeto tem pasta `ui/`, mas todo projeto React tem `components/`

## Resumindo

- **Component**: Qualquer bloco reutilizável de interface
- **UI**: Pode ser o conjunto de componentes visuais básicos, ou toda a interface

No seu projeto, foque em `components/` para encontrar os blocos de interface reutilizáveis.
