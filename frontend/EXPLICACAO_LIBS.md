# Explicação de Libs no Frontend

A pasta `lib/` geralmente armazena funções utilitárias, integrações externas ou código que não pertence a um componente visual, hook ou service. São "bibliotecas" internas do projeto.

## O que pode ter em lib?

- Funções utilitárias (ex: formatação de datas, helpers)
- Integrações com bibliotecas externas (ex: PDF.js, manipulação de arquivos)
- Código compartilhado entre vários componentes/hooks/services

## Exemplo

```typescript
// src/lib/formatDate.ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR");
}
```

## Dicas

- Use `lib/` para tudo que não é interface, hook ou service
- Ajuda a evitar duplicação de código
- Facilita testes e manutenção

Veja exemplos em `src/lib/`.
