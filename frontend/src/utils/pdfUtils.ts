// Utilitários para manipulação de PDFs
import { jsPDF } from 'jspdf';
import { PDFDocument } from 'pdf-lib';

// Gerar PDF a partir de texto
export const generatePDFFromText = (text: string, filename: string = 'document.pdf') => {
  const doc = new jsPDF();
  const lines = doc.splitTextToSize(text, 180);
  doc.text(lines, 10, 10);
  doc.save(filename);
};

// Mesclar múltiplos PDFs
export const mergePDFs = async (pdfFiles: File[]): Promise<Uint8Array> => {
  const mergedPdf = await PDFDocument.create();
  
  for (const file of pdfFiles) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }
  
  return mergedPdf.save();
};

// Extrair texto de PDF usando PDF.js
export const extractTextFromPDF = async (pdfUrl: string): Promise<string> => {
  const { getDocument } = await import('pdfjs-dist');
  const pdf = await getDocument(pdfUrl).promise;
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }
  
  return fullText;
};

// Converter HTML para PDF
export const htmlToPDF = (htmlContent: string, filename: string = 'converted.pdf') => {
  const doc = new jsPDF();
  doc.html(htmlContent, {
    callback: function (doc) {
      doc.save(filename);
    },
    x: 10,
    y: 10
  });
};
