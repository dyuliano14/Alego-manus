# Explicação dos Utilitários (Utils)

O projeto pode conter funções utilitárias para tarefas específicas, como extração de texto de PDF, manipulação de arquivos, etc. Normalmente ficam em arquivos como `pdf_utils.py`.

## Exemplo: pdf_utils.py

- **extract_text_from_pdf(file_path)**: Função que recebe o caminho de um PDF e retorna o texto extraído.
- Pode usar bibliotecas como PyPDF2, pdfminer, etc.

## Por que separar utilitários?

- Mantém o código organizado
- Facilita a reutilização de funções em diferentes partes do projeto
- Ajuda na manutenção e testes

## Dicas

- Sempre que uma função não for específica de um endpoint/modelo, coloque em um utilitário
- Nomeie os arquivos utilitários de acordo com a função principal (ex: `pdf_utils.py` para PDF)

Se quiser ver exemplos, abra o arquivo `backend/pdf_utils.py`.
