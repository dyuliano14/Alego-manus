# Guia Prático: Como Criar uma Nova Funcionalidade do Zero (Exemplo: Controle de Usuário)

Este guia mostra, passo a passo, como pensar, planejar e implementar uma nova funcionalidade no seu projeto, usando como exemplo o controle de usuários. Serve para qualquer nova página ou recurso!

---

## 1. Planejamento: O que você precisa?

- **Quais dados?** (ex: nome, email, senha, tipo)
- **Quais ações?** (ex: criar, listar, editar, deletar usuário)
- **Quem pode acessar?** (permissão, autenticação)

---

## 2. Backend

### a) Model (database.py)

- Crie a classe `Usuario` com os campos necessários.
- Adicione o método `to_dict()`.

```python
class Usuario(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha = db.Column(db.String(128), nullable=False)
    tipo = db.Column(db.String(20), default='comum')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'email': self.email,
            'tipo': self.tipo,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
```

### b) Rotas (app.py ou routes/usuario_routes.py)

- Importe o modelo e o db.
- Crie endpoints para GET, POST, PUT, DELETE.

```python
@app.route('/api/usuarios', methods=['GET', 'POST'])
def usuarios():
    if request.method == 'GET':
        return jsonify([u.to_dict() for u in Usuario.query.all()])
    if request.method == 'POST':
        data = request.get_json()
        novo = Usuario(nome=data['nome'], email=data['email'], senha=data['senha'])
        db.session.add(novo)
        db.session.commit()
        return jsonify(novo.to_dict()), 201

@app.route('/api/usuarios/<int:usuario_id>', methods=['PUT', 'DELETE'])
def usuario_individual(usuario_id):
    usuario = Usuario.query.get_or_404(usuario_id)
    if request.method == 'PUT':
        data = request.get_json()
        usuario.nome = data.get('nome', usuario.nome)
        usuario.email = data.get('email', usuario.email)
        db.session.commit()
        return jsonify(usuario.to_dict())
    if request.method == 'DELETE':
        db.session.delete(usuario)
        db.session.commit()
        return '', 204
```

### c) Atualize o banco

- Apague o banco antigo se necessário e rode o backend para criar a nova tabela.

---

## 3. Frontend

### a) Service (src/services/usuarioService.ts)

- Centraliza as chamadas HTTP para a API de usuários.

```typescript
import axios from "axios";
export async function getUsuarios() {
  const res = await axios.get("/api/usuarios");
  return res.data;
}
export async function createUsuario(data) {
  const res = await axios.post("/api/usuarios", data);
  return res.data;
}
// ... outros métodos (update, delete)
```

### b) Hook (src/hooks/useUsuarios.ts)

- Facilita o uso dos dados de usuário nos componentes.

```typescript
import { useState, useEffect } from "react";
import { getUsuarios } from "../services/usuarioService";
export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  useEffect(() => {
    getUsuarios().then(setUsuarios);
  }, []);
  return usuarios;
}
```

### c) Component (src/components/UsuarioForm.tsx)

- Formulário para criar/editar usuário.

```tsx
import React, { useState } from "react";
import { createUsuario } from "../services/usuarioService";
export function UsuarioForm() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  // ...
  const handleSubmit = async (e) => {
    e.preventDefault();
    await createUsuario({ nome, email });
    // feedback, limpar campos, etc
  };
  return (
    <form onSubmit={handleSubmit}>
      <input value={nome} onChange={(e) => setNome(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Salvar</button>
    </form>
  );
}
```

### d) Page (src/pages/UsuariosPage.tsx)

- Página que lista e gerencia usuários.

```tsx
import { useUsuarios } from "../hooks/useUsuarios";
export function UsuariosPage() {
  const usuarios = useUsuarios();
  return (
    <div>
      <h1>Usuários</h1>
      <ul>
        {usuarios.map((u) => (
          <li key={u.id}>
            {u.nome} ({u.email})
          </li>
        ))}
      </ul>
      {/* <UsuarioForm /> pode ser incluído aqui */}
    </div>
  );
}
```

---

## 4. O que pensar e planejar

- **Dados**: Quais campos? (nome, email, senha...)
- **Ações**: O que o usuário pode fazer? (listar, criar, editar, deletar)
- **Permissões**: Quem pode acessar cada ação?
- **Fluxo**: Como o frontend vai consumir a API?
- **Validação**: Como garantir que os dados estão corretos?
- **Feedback**: Como mostrar sucesso/erro para o usuário?

---

## 5. Próximos Passos

- Adicionar autenticação (login/logout) e proteção de rotas
- Criar validação de dados no backend e frontend
- Melhorar feedback visual (mensagens, loaders)
- Escrever testes (opcional, mas recomendado)
- Documentar a API e o fluxo da funcionalidade

---

## Resumo

1. **Planeje** os dados e ações
2. **Implemente o model** no backend
3. **Crie as rotas** (endpoints)
4. **Atualize o banco**
5. **Implemente o service, hook, component e page** no frontend
6. **Teste tudo**
7. **Documente**

Siga esse roteiro para qualquer nova funcionalidade e nunca mais vai travar!
