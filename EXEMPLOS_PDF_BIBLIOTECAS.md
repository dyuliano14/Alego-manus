# Roteiro e Exemplos: Bibliotecas de PDF (Frontend e Backend)

Este guia traz exemplos práticos e links para estudar as principais bibliotecas de PDF para visualização, conversão e manipulação.

---

## Frontend (JavaScript/TypeScript)

### 1. Visualizar PDF com react-pdf

- Instale:
  ```bash
  npm install @react-pdf-viewer/core @react-pdf-viewer/default-layout
  npm install react-pdf
  ```
- Exemplo:
  ```tsx
  import { Document, Page } from "react-pdf";
  import "react-pdf/dist/esm/Page/AnnotationLayer.css";
  export function VisualizadorPDF({ fileUrl }) {
    return (
      <Document file={fileUrl}>
        <Page pageNumber={1} />
      </Document>
    );
  }
  ```
- [react-pdf (docs)](https://github.com/wojtekmaj/react-pdf)
- [pdf.js (docs)](https://mozilla.github.io/pdf.js/)

### 2. Manipular PDF com pdf-lib

- Instale:
  ```bash
  npm install pdf-lib
  ```
- Exemplo:
  ```js
  import { PDFDocument } from "pdf-lib";
  // Carregar e manipular PDF
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();
  // ...
  ```
- [pdf-lib (docs)](https://pdf-lib.js.org/)

---

## Backend (Python)

### 1. Extrair texto com PyPDF2

- Instale:
  ```bash
  pip install PyPDF2
  ```
- Exemplo:
  ```python
  from PyPDF2 import PdfReader
  reader = PdfReader('arquivo.pdf')
  texto = ''
  for page in reader.pages:
      texto += page.extract_text()
  print(texto)
  ```
- [PyPDF2 (docs)](https://pypdf2.readthedocs.io/)

### 2. Converter PDF para Word com pdf2docx

- Instale:
  ```bash
  pip install pdf2docx
  ```
- Exemplo:
  ```python
  from pdf2docx import Converter
  cv = Converter('arquivo.pdf')
  cv.convert('saida.docx', start=0, end=None)
  cv.close()
  ```
- [pdf2docx (docs)](https://github.com/dothinking/pdf2docx)

### 3. Gerar PDF com reportlab

- Instale:
  ```bash
  pip install reportlab
  ```
- Exemplo:
  ```python
  from reportlab.pdfgen import canvas
  c = canvas.Canvas('exemplo.pdf')
  c.drawString(100, 750, 'Olá, PDF!')
  c.save()
  ```
- [reportlab (docs)](https://www.reportlab.com/docs/reportlab-userguide.pdf)

---

Estude os links e exemplos para dominar PDF no frontend e backend!
