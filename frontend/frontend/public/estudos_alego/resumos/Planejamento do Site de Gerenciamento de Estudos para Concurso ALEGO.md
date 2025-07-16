# Planejamento do Site de Gerenciamento de Estudos para Concurso ALEGO

## Visão Geral

O site será uma plataforma completa para gerenciamento de estudos, focada nas metodologias ativas definidas no plano de estudos. A arquitetura será baseada em uma aplicação web responsiva, permitindo acesso em diferentes dispositivos e facilitando o estudo em qualquer lugar.

## Requisitos Funcionais

### 1. Gerenciamento de Materiais
- Upload e organização de PDFs por categoria/disciplina
- Visualização integrada de documentos
- Sistema de tags e busca para localização rápida de conteúdos
- Controle de versões para atualizações de materiais

### 2. Resumos em Markdown
- Editor de Markdown com preview em tempo real
- Organização hierárquica de resumos (por disciplina, capítulo, tópico)
- Exportação para PDF
- Sistema de links internos entre resumos relacionados
- Histórico de revisões

### 3. Sistema de Flashcards
- Criação de flashcards com frente (pergunta) e verso (resposta)
- Organização por coleções temáticas
- Sistema de repetição espaçada (SRS) baseado no algoritmo SM-2
- Estatísticas de desempenho e progresso
- Modo de estudo com diferentes opções (revisão, teste, aleatório)

### 4. Simulados e Questões
- Banco de questões categorizadas por tema e dificuldade
- Criação de simulados personalizados
- Simulados cronometrados com condições similares à prova
- Análise detalhada de desempenho
- Histórico de simulados realizados

### 5. Espaço Feynman
- Área para gravação/escrita de explicações no estilo Feynman
- Templates guiados para estruturar explicações
- Sistema de avaliação da clareza e completude das explicações
- Histórico de explicações por tema

### 6. Planejamento e Progresso
- Calendário de estudos integrado
- Sistema de metas diárias, semanais e mensais
- Visualização de progresso por disciplina
- Alertas para revisões programadas
- Dashboard com métricas de desempenho

### 7. Integração de Novas Matérias
- Interface para adição de novas disciplinas
- Assistente de estruturação de conteúdo
- Importação de materiais externos
- Integração automática ao sistema de revisão espaçada

## Arquitetura Técnica

### Frontend
- **Framework**: React.js com TypeScript
- **Bibliotecas UI**: Tailwind CSS, shadcn/ui para componentes
- **Gerenciamento de Estado**: React Context API ou Redux
- **Roteamento**: React Router
- **Editores**: React Markdown para resumos, editor personalizado para flashcards

### Backend (API)
- **Framework**: Flask (Python)
- **Banco de Dados**: SQLite para desenvolvimento, MySQL para produção
- **Autenticação**: Sistema simples de login/senha
- **Armazenamento de Arquivos**: Sistema de arquivos local

### Persistência de Dados
- **Estrutura de Banco de Dados**:
  - Tabelas para usuários, materiais, resumos, flashcards, questões, simulados, explicações Feynman
  - Relacionamentos para organização hierárquica e categorização
  - Metadados para tracking de progresso e estatísticas

## Design de Interface

### Princípios de Design
- Interface limpa e focada no conteúdo
- Navegação intuitiva e consistente
- Design responsivo para todos os dispositivos
- Modo escuro/claro para conforto visual
- Feedback visual claro para ações do usuário

### Estrutura de Navegação
- **Barra Lateral**: Acesso rápido às principais seções
- **Cabeçalho**: Busca global, notificações, perfil
- **Área Principal**: Conteúdo contextual da seção atual
- **Rodapé**: Links úteis, informações de versão

### Páginas Principais
1. **Dashboard**: Visão geral do progresso, próximas revisões, atividades recentes
2. **Biblioteca**: Organização de todos os materiais de estudo
3. **Resumos**: Sistema de criação e visualização de resumos
4. **Flashcards**: Interface para estudo com flashcards
5. **Simulados**: Criação e realização de simulados
6. **Espaço Feynman**: Área para praticar explicações
7. **Planejamento**: Calendário e sistema de metas
8. **Configurações**: Personalização da plataforma

## Fluxos de Usuário

### Fluxo de Estudo Diário
1. Usuário acessa o dashboard
2. Visualiza as atividades programadas para o dia
3. Acessa o material de estudo recomendado
4. Cria resumos e flashcards durante o estudo
5. Pratica com flashcards programados para revisão
6. Registra explicações Feynman sobre o conteúdo estudado
7. Realiza questões de fixação
8. Marca atividades como concluídas

### Fluxo de Revisão Espaçada
1. Sistema notifica sobre revisões programadas
2. Usuário acessa conjunto de flashcards para revisão
3. Realiza a revisão, classificando seu desempenho
4. Sistema recalcula próximas datas de revisão
5. Usuário visualiza estatísticas de retenção

### Fluxo de Simulado
1. Usuário seleciona criar novo simulado
2. Configura parâmetros (tempo, número de questões, temas)
3. Inicia simulado cronometrado
4. Responde às questões dentro do tempo limite
5. Finaliza e visualiza resultados detalhados
6. Revisa questões incorretas
7. Sistema registra desempenho para análise de progresso

## Implementação Incremental

### Fase 1: MVP (Minimum Viable Product)
- Estrutura básica do site
- Upload e visualização de PDFs
- Editor de resumos em Markdown
- Sistema simples de flashcards
- Dashboard básico

### Fase 2: Recursos Avançados
- Sistema completo de repetição espaçada
- Simulados e banco de questões
- Espaço Feynman estruturado
- Estatísticas e análises de desempenho

### Fase 3: Refinamento e Expansão
- Melhorias de UX/UI baseadas em feedback
- Recursos avançados de personalização
- Otimizações de performance
- Expansão para novas funcionalidades

## Considerações Técnicas

### Segurança
- Proteção de dados pessoais
- Backup regular de conteúdos
- Validação de entradas de usuário

### Performance
- Carregamento otimizado de PDFs
- Paginação para grandes conjuntos de dados
- Lazy loading de componentes

### Acessibilidade
- Conformidade com WCAG 2.1
- Suporte a navegação por teclado
- Textos alternativos para imagens

## Conclusão

Este planejamento estabelece as bases para o desenvolvimento de um site completo de gerenciamento de estudos, alinhado com as metodologias ativas definidas no plano pedagógico. A implementação incremental permitirá validar funcionalidades e ajustar o desenvolvimento conforme necessário, garantindo uma plataforma eficaz para o estudo preparatório para o concurso da ALEGO.
