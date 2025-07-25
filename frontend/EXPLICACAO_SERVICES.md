# Explicação de Services no Frontend

Services são funções que centralizam a comunicação do frontend com o backend (API). Eles deixam o código mais organizado, facilitam a manutenção e o reuso das chamadas HTTP.

## O que fazem os services?

- Fazem requisições HTTP (GET, POST, PUT, DELETE) para a API
- Podem tratar erros e formatar dados antes de entregar para os componentes/hooks
- Permitem que a lógica de comunicação fique separada da interface

## Exemplo de Service

```typescript
// src/services/cursosService.ts
import axios from "axios";

export async function getCursos() {
  const response = await axios.get("/api/cursos");
  return response.data;
}
```

## Dicas

- Services ficam em `src/services/`
- Use services dentro de hooks ou componentes para buscar ou enviar dados
- Facilita a troca de backend ou ajustes de API sem mexer em toda a interface
