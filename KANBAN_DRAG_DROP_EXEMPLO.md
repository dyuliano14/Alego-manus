# Roteiro e Exemplo: Kanban Arrastável (Drag and Drop)

Este guia mostra como criar um quadro kanban arrastável em React usando a biblioteca `react-beautiful-dnd` (a mesma base do Trello).

---

## 1. Instale a biblioteca

```bash
npm install react-beautiful-dnd
```

[Documentação oficial](https://github.com/atlassian/react-beautiful-dnd)

---

## 2. Estrutura básica do Kanban

- Crie colunas (ex: "A Fazer", "Fazendo", "Feito")
- Cada coluna tem uma lista de cards/tarefas
- Cards podem ser arrastados entre colunas

---

## 3. Exemplo de Código

```tsx
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const colunasIniciais = {
  afazer: {
    nome: "A Fazer",
    items: [
      { id: "1", conteudo: "Estudar React" },
      { id: "2", conteudo: "Ler documentação" },
    ],
  },
  fazendo: { nome: "Fazendo", items: [] },
  feito: { nome: "Feito", items: [] },
};

export function Kanban() {
  const [colunas, setColunas] = useState(colunasIniciais);

  function onDragEnd(result) {
    if (!result.destination) return;
    const { source, destination } = result;
    const sourceCol = colunas[source.droppableId];
    const destCol = colunas[destination.droppableId];
    const sourceItems = [...sourceCol.items];
    const destItems = [...destCol.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColunas({
      ...colunas,
      [source.droppableId]: { ...sourceCol, items: sourceItems },
      [destination.droppableId]: { ...destCol, items: destItems },
    });
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: "flex", gap: 16 }}>
        {Object.entries(colunas).map(([colId, col]) => (
          <Droppable droppableId={colId} key={colId}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ background: "#eee", padding: 8, minWidth: 200 }}
              >
                <h3>{col.nome}</h3>
                {col.items.map((item, idx) => (
                  <Draggable key={item.id} draggableId={item.id} index={idx}>
                    {(prov) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                        style={{
                          background: "#fff",
                          margin: 4,
                          padding: 8,
                          ...prov.draggableProps.style,
                        }}
                      >
                        {item.conteudo}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
```

---

## 4. Outras bibliotecas para Drag and Drop

- [react-dnd](https://react-dnd.github.io/react-dnd/about)
- [SortableJS](https://sortablejs.github.io/Sortable/)

---

Com esse exemplo, você pode criar seu próprio kanban arrastável!
