import PyPDF2
import re
import os
from typing import Dict, List, Tuple

class PDFExtractor:
    """Classe para extrair e processar texto de documentos PDF de legislação."""
    
    def __init__(self, pdf_path: str):
        """
        Inicializa o extrator com o caminho para o PDF.
        
        Args:
            pdf_path: Caminho para o arquivo PDF da legislação
        """
        self.pdf_path = pdf_path
        self.text_by_article = {}
        self.articles = []
        self.keywords = set()
        
    def extract_text(self) -> str:
        """Extrai todo o texto do PDF."""
        text = ""
        with open(self.pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                text += page.extract_text()
        return text
    
    def extract_articles(self) -> Dict[str, str]:
        """
        Extrai artigos individuais da legislação.
        
        Returns:
            Um dicionário mapeando identificadores de artigos para seus textos
        """
        full_text = self.extract_text()
        
        # Regex para encontrar artigos (pode precisar de ajustes com base no formato exato)
        article_pattern = r'Art\.\s+(\d+)[º°]?\s*[-–.]?\s*(.*?)(?=Art\.\s+\d+[º°]?|$)'
        matches = re.finditer(article_pattern, full_text, re.DOTALL)
        
        for match in matches:
            article_num = match.group(1)
            article_text = match.group(2).strip()
            self.text_by_article[f"Art. {article_num}"] = article_text
            self.articles.append((f"Art. {article_num}", article_text))
            
        return self.text_by_article
    
    def extract_keywords(self, min_length: int = 4) -> List[str]:
        """
        Extrai palavras-chave potenciais dos artigos.
        
        Args:
            min_length: Comprimento mínimo para considerar uma palavra como palavra-chave
            
        Returns:
            Lista de palavras-chave potenciais
        """
        if not self.text_by_article:
            self.extract_articles()
            
        # Palavras comuns a serem excluídas
        stopwords = {"para", "como", "que", "este", "esta", "pelo", "pela", "dos", "das", "nos", "nas"}
        
        for _, text in self.text_by_article.items():
            # Remover pontuação e dividir em palavras
            words = re.findall(r'\b\w+\b', text.lower())
            
            # Filtrar palavras significativas
            for word in words:
                if (len(word) >= min_length and 
                    word not in stopwords and 
                    not word.isdigit()):
                    self.keywords.add(word)
        
        return list(self.keywords)
    
    def get_paragraph_with_context(self, article_id: str, keyword: str) -> Tuple[str, List[int]]:
        """
        Retorna um parágrafo contendo a palavra-chave e suas posições.
        
        Args:
            article_id: ID do artigo (ex: "Art. 1")
            keyword: Palavra-chave a ser destacada
            
        Returns:
            Tuple contendo o parágrafo e uma lista de posições iniciais da palavra-chave
        """
        if article_id not in self.text_by_article:
            return "", []
            
        text = self.text_by_article[article_id]
        paragraphs = text.split('\n')
        
        for paragraph in paragraphs:
            if keyword.lower() in paragraph.lower():
                positions = []
                lower_para = paragraph.lower()
                lower_keyword = keyword.lower()
                start = 0
                
                while True:
                    pos = lower_para.find(lower_keyword, start)
                    if pos == -1:
                        break
                    positions.append(pos)
                    start = pos + len(lower_keyword)
                
                return paragraph, positions
                
        return "", []