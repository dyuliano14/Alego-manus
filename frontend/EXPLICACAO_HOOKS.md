# Explicação de Hooks no Frontend

Hooks são funções especiais do React (e do React com TypeScript) que permitem usar e compartilhar lógica de estado e efeitos em componentes funcionais. Eles facilitam a reutilização de código e deixam o frontend mais organizado.

## Tipos de Hooks

- **Hooks do React**: useState, useEffect, useContext, useRef, etc.
- **Hooks customizados**: Funções criadas pelo próprio projeto para lógica reutilizável (ex: useCursos, useUpload)

## Exemplo de Hook Customizado

```typescript
// src/hooks/useCursos.ts
import { useState, useEffect } from "react";
import { getCursos } from "../services/cursosService";

export function useCursos() {
  const [cursos, setCursos] = useState([]);
  useEffect(() => {
    getCursos().then(setCursos);
  }, []);
  return cursos;
}
```

## Dicas

- Use hooks para buscar dados, controlar formulários, lidar com autenticação, etc.
- Hooks customizados sempre começam com "use".
- Deixam o código dos componentes mais limpo e fácil de testar.

Veja exemplos em `src/hooks/`.
