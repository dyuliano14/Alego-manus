# Utilitários para manipulação de PDFs no backend
from flask import Flask, request, jsonify, send_file
import PyPDF2
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import io
import os

class PDFProcessor:
    """Classe para processar PDFs no backend"""
    
    @staticmethod
    def extract_text_from_pdf(pdf_path):
        """Extrai texto de um arquivo PDF"""
        text = ""
        try:
            with open(pdf_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                for page in reader.pages:
                    text += page.extract_text()
        except Exception as e:
            print(f"Erro ao extrair texto: {e}")
        return text
    
    @staticmethod
    def merge_pdfs(pdf_paths, output_path):
        """Mescla múltiplos PDFs em um único arquivo"""
        writer = PyPDF2.PdfWriter()
        
        try:
            for pdf_path in pdf_paths:
                with open(pdf_path, 'rb') as file:
                    reader = PyPDF2.PdfReader(file)
                    for page in reader.pages:
                        writer.add_page(page)
            
            with open(output_path, 'wb') as output_file:
                writer.write(output_file)
            return True
        except Exception as e:
            print(f"Erro ao mesclar PDFs: {e}")
            return False
    
    @staticmethod
    def create_pdf_from_text(text, output_path):
        """Cria um PDF a partir de texto"""
        try:
            c = canvas.Canvas(output_path, pagesize=letter)
            width, height = letter
            
            # Configurações de texto
            c.setFont("Helvetica", 12)
            text_lines = text.split('\n')
            y_position = height - 40
            
            for line in text_lines:
                if y_position < 40:  # Nova página se necessário
                    c.showPage()
                    c.setFont("Helvetica", 12)
                    y_position = height - 40
                
                c.drawString(40, y_position, line)
                y_position -= 20
            
            c.save()
            return True
        except Exception as e:
            print(f"Erro ao criar PDF: {e}")
            return False
    
    @staticmethod
    def split_pdf(pdf_path, output_dir):
        """Divide um PDF em páginas separadas"""
        try:
            with open(pdf_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                
                for i, page in enumerate(reader.pages):
                    writer = PyPDF2.PdfWriter()
                    writer.add_page(page)
                    
                    output_filename = f"{output_dir}/page_{i+1}.pdf"
                    with open(output_filename, 'wb') as output_file:
                        writer.write(output_file)
            return True
        except Exception as e:
            print(f"Erro ao dividir PDF: {e}")
            return False

# Rotas Flask para manipulação de PDFs
def create_pdf_routes(app):
    """Cria rotas para manipulação de PDFs"""
    
    @app.route('/api/pdf/extract-text', methods=['POST'])
    def extract_text():
        """Extrai texto de um PDF enviado"""
        if 'file' not in request.files:
            return jsonify({'error': 'Nenhum arquivo enviado'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'Nenhum arquivo selecionado'}), 400
        
        if file and file.filename.endswith('.pdf'):
            # Salva temporariamente
            temp_path = f"/tmp/{file.filename}"
            file.save(temp_path)
            
            # Extrai texto
            text = PDFProcessor.extract_text_from_pdf(temp_path)
            
            # Remove arquivo temporário
            os.remove(temp_path)
            
            return jsonify({'text': text})
        
        return jsonify({'error': 'Arquivo deve ser um PDF'}), 400
    
    @app.route('/api/pdf/merge', methods=['POST'])
    def merge_pdfs():
        """Mescla múltiplos PDFs"""
        files = request.files.getlist('files')
        
        if len(files) < 2:
            return jsonify({'error': 'Pelo menos 2 arquivos necessários'}), 400
        
        temp_paths = []
        for file in files:
            if file.filename.endswith('.pdf'):
                temp_path = f"/tmp/{file.filename}"
                file.save(temp_path)
                temp_paths.append(temp_path)
        
        output_path = "/tmp/merged.pdf"
        success = PDFProcessor.merge_pdfs(temp_paths, output_path)
        
        # Limpa arquivos temporários
        for path in temp_paths:
            os.remove(path)
        
        if success:
            return send_file(output_path, as_attachment=True, download_name="merged.pdf")
        else:
            return jsonify({'error': 'Erro ao mesclar PDFs'}), 500
    
    @app.route('/api/pdf/create-from-text', methods=['POST'])
    def create_from_text():
        """Cria PDF a partir de texto"""
        data = request.get_json()
        text = data.get('text', '')
        filename = data.get('filename', 'document.pdf')
        
        if not text:
            return jsonify({'error': 'Texto não fornecido'}), 400
        
        output_path = f"/tmp/{filename}"
        success = PDFProcessor.create_pdf_from_text(text, output_path)
        
        if success:
            return send_file(output_path, as_attachment=True, download_name=filename)
        else:
            return jsonify({'error': 'Erro ao criar PDF'}), 500
