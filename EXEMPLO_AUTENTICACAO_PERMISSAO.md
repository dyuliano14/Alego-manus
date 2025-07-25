# Exemplo de Autenticação e Permissões para Controle de Usuário

Este exemplo mostra como implementar autenticação (login/logout), hash de senha e proteção de rotas no backend (Flask) e frontend (React).

---

## 1. Backend (Flask)

### a) Hash de Senha no Model

```python
from werkzeug.security import generate_password_hash, check_password_hash

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha_hash = db.Column(db.String(128), nullable=False)
    tipo = db.Column(db.String(20), default='comum')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_senha(self, senha):
        self.senha_hash = generate_password_hash(senha)
    def check_senha(self, senha):
        return check_password_hash(self.senha_hash, senha)
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'email': self.email,
            'tipo': self.tipo,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
```

### b) Endpoint de Registro e Login

```python
@app.route('/api/usuarios', methods=['POST'])
def criar_usuario():
    data = request.get_json()
    usuario = Usuario(nome=data['nome'], email=data['email'])
    usuario.set_senha(data['senha'])
    db.session.add(usuario)
    db.session.commit()
    return jsonify(usuario.to_dict()), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    usuario = Usuario.query.filter_by(email=data['email']).first()
    if usuario and usuario.check_senha(data['senha']):
        # Exemplo simples: retorna id e tipo (use JWT para produção)
        return jsonify({'id': usuario.id, 'tipo': usuario.tipo, 'nome': usuario.nome})
    return jsonify({'error': 'Credenciais inválidas'}), 401
```

### c) Proteção de Rotas (Permissões)

```python
from functools import wraps

def require_admin(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Exemplo: pega tipo do usuário do request (use JWT para produção)
        tipo = request.headers.get('X-Tipo-Usuario')
        if tipo != 'admin':
            return jsonify({'error': 'Acesso negado'}), 403
        return f(*args, **kwargs)
    return decorated

@app.route('/api/usuarios/<int:usuario_id>', methods=['DELETE'])
@require_admin
def deletar_usuario(usuario_id):
    usuario = Usuario.query.get_or_404(usuario_id)
    db.session.delete(usuario)
    db.session.commit()
    return '', 204
```

---

## 2. Frontend (React + TypeScript)

### a) Login e Armazenamento do Usuário

```typescript
import axios from "axios";
export async function login(email: string, senha: string) {
  const res = await axios.post("/api/login", { email, senha });
  // Salve o usuário no localStorage ou contexto
  localStorage.setItem("usuario", JSON.stringify(res.data));
  return res.data;
}
export function getUsuarioAtual() {
  const data = localStorage.getItem("usuario");
  return data ? JSON.parse(data) : null;
}
export function logout() {
  localStorage.removeItem("usuario");
}
```

### b) Proteção de Rotas no Frontend

```tsx
import { getUsuarioAtual } from "../services/usuarioService";
export function RotaPrivada({ children }) {
  const usuario = getUsuarioAtual();
  if (!usuario) {
    return <div>Você precisa estar logado.</div>;
  }
  return children;
}
```

### c) Exemplo de Uso

```tsx
<RotaPrivada>
  <UsuariosPage />
</RotaPrivada>
```

---

## Dicas

- Para produção, use JWT (Json Web Token) para autenticação.
- Sempre faça hash da senha no backend.
- Nunca envie a senha em texto puro para o frontend.
- Use context ou Redux para guardar o usuário logado.
- Adapte os exemplos para sua estrutura.

Se quiser exemplos de JWT, refresh token, ou autenticação social, só pedir!
