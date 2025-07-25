# Exemplo Completo de CRUD de Usuário (Backend e Frontend)

Este exemplo mostra como implementar um CRUD completo de usuários, pronto para ser adaptado ao seu projeto.

---

## Backend (Flask)

### 1. Model (database.py)

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

### 2. Rotas (app.py ou routes/usuario_routes.py)

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

@app.route('/api/usuarios/<int:usuario_id>', methods=['GET', 'PUT', 'DELETE'])
def usuario_individual(usuario_id):
    usuario = Usuario.query.get_or_404(usuario_id)
    if request.method == 'GET':
        return jsonify(usuario.to_dict())
    if request.method == 'PUT':
        data = request.get_json()
        usuario.nome = data.get('nome', usuario.nome)
        usuario.email = data.get('email', usuario.email)
        usuario.senha = data.get('senha', usuario.senha)
        usuario.tipo = data.get('tipo', usuario.tipo)
        db.session.commit()
        return jsonify(usuario.to_dict())
    if request.method == 'DELETE':
        db.session.delete(usuario)
        db.session.commit()
        return '', 204
```

---

## Frontend (React + TypeScript)

### 1. Service (src/services/usuarioService.ts)

```typescript
import axios from "axios";
export async function getUsuarios() {
  const res = await axios.get("/api/usuarios");
  return res.data;
}
export async function getUsuario(id: number) {
  const res = await axios.get(`/api/usuarios/${id}`);
  return res.data;
}
export async function createUsuario(data) {
  const res = await axios.post("/api/usuarios", data);
  return res.data;
}
export async function updateUsuario(id: number, data) {
  const res = await axios.put(`/api/usuarios/${id}`, data);
  return res.data;
}
export async function deleteUsuario(id: number) {
  await axios.delete(`/api/usuarios/${id}`);
}
```

### 2. Hook (src/hooks/useUsuarios.ts)

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

### 3. Component (src/components/UsuarioForm.tsx)

```tsx
import React, { useState } from "react";
import { createUsuario, updateUsuario } from "../services/usuarioService";
export function UsuarioForm({ usuario, onSave }) {
  const [nome, setNome] = useState(usuario?.nome || "");
  const [email, setEmail] = useState(usuario?.email || "");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState(usuario?.tipo || "comum");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (usuario) {
      await updateUsuario(usuario.id, { nome, email, senha, tipo });
    } else {
      await createUsuario({ nome, email, senha, tipo });
    }
    if (onSave) onSave();
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        placeholder="Senha"
        type="password"
      />
      <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
        <option value="comum">Comum</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Salvar</button>
    </form>
  );
}
```

### 4. Page (src/pages/UsuariosPage.tsx)

```tsx
import React, { useState } from "react";
import { useUsuarios } from "../hooks/useUsuarios";
import { deleteUsuario } from "../services/usuarioService";
import { UsuarioForm } from "../components/UsuarioForm";
export function UsuariosPage() {
  const usuarios = useUsuarios();
  const [editing, setEditing] = useState(null);
  const handleDelete = async (id) => {
    await deleteUsuario(id);
    window.location.reload();
  };
  return (
    <div>
      <h1>Usuários</h1>
      <UsuarioForm usuario={editing} onSave={() => setEditing(null)} />
      <ul>
        {usuarios.map((u) => (
          <li key={u.id}>
            {u.nome} ({u.email}) [{u.tipo}]
            <button onClick={() => setEditing(u)}>Editar</button>
            <button onClick={() => handleDelete(u.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Dicas

- Adapte os exemplos para sua estrutura de pastas.
- Implemente autenticação e proteção de rotas para produção.
- Sempre valide os dados no backend e frontend.
- Use feedback visual para sucesso/erro.

Pronto! Com esse exemplo, você pode criar, listar, editar e excluir usuários facilmente.
