from typing import List, Dict, Tuple, Optional
import random
from game_module.extractor import PDFExtractor

class GameLevel:
    """Representa um nível no jogo de aprendizado."""
    
    def __init__(self, article_id: str, article_text: str, keywords: List[str]):
        self.article_id = article_id
        self.original_text = article_text
        self.keywords = keywords
        self.masked_text = self._create_masked_text()
        self.completion_status = False
        
    def _create_masked_text(self) -> str:
        """Cria uma versão do texto com palavras-chave mascaradas."""
        text = self.original_text
        for keyword in self.keywords:
            # Substitui a palavra-chave por um espaço sublinhado do mesmo tamanho
            placeholder = "_" * len(keyword)
            text = text.replace(keyword, placeholder)
        return text
    
    def check_answer(self, position: int, user_input: str) -> bool:
        """
        Verifica se a resposta do usuário está correta para uma posição específica.
        
        Args:
            position: Índice da palavra-chave sendo verificada
            user_input: Entrada do usuário
            
        Returns:
            True se a resposta estiver correta, False caso contrário
        """
        if position < 0 or position >= len(self.keywords):
            return False
            
        return user_input.lower() == self.keywords[position].lower()
    
    def is_completed(self) -> bool:
        """Verifica se o nível foi concluído."""
        return self.completion_status
    
    def mark_completed(self):
        """Marca o nível como concluído."""
        self.completion_status = True


class GameEngine:
    """Motor principal do jogo de aprendizado de legislação."""
    
    def __init__(self, pdf_extractor: PDFExtractor):
        self.extractor = pdf_extractor
        self.levels = []
        self.current_level_index = 0
        self.max_keywords_phase1 = 5  # Número máximo de palavras-chave na fase 1
        self.max_keywords_phase2 = 3  # Número máximo de palavras-chave na fase 2
        self.current_phase = 1
        
    def initialize_game(self):
        """Inicializa o jogo extraindo artigos e palavras-chave."""
        # Extrair artigos e palavras-chave
        self.extractor.extract_articles()
        all_keywords = self.extractor.extract_keywords()
        
        # Criar níveis para cada artigo
        for article_id, article_text in self.extractor.articles:
            # Selecionar palavras-chave relevantes para este artigo
            article_keywords = [kw for kw in all_keywords 
                               if kw.lower() in article_text.lower()]
            
            # Limitar o número de palavras-chave para não tornar muito difícil
            if len(article_keywords) > self.max_keywords_phase1:
                article_keywords = random.sample(article_keywords, self.max_keywords_phase1)
                
            if article_keywords:  # Só criar nível se houver palavras-chave
                level = GameLevel(article_id, article_text, article_keywords)
                self.levels.append(level)
    
    def get_current_level(self) -> Optional[GameLevel]:
        """Retorna o nível atual do jogo."""
        if 0 <= self.current_level_index < len(self.levels):
            return self.levels[self.current_level_index]
        return None
    
    def advance_level(self) -> bool:
        """
        Avança para o próximo nível.
        
        Returns:
            True se houver um próximo nível, False se o jogo terminou
        """
        self.current_level_index += 1
        if self.current_level_index >= len(self.levels):
            if self.current_phase < 3:
                # Avançar para a próxima fase
                self.current_phase += 1
                self.current_level_index = 0
                self._adjust_difficulty_for_phase()
                return True
            return False
        return True
    
    def _adjust_difficulty_for_phase(self):
        """Ajusta a dificuldade com base na fase atual."""
        if self.current_phase == 2:
            # Reduzir o número de palavras-chave disponíveis
            for level in self.levels:
                if len(level.keywords) > self.max_keywords_phase2:
                    level.keywords = random.sample(level.keywords, self.max_keywords_phase2)
                level.masked_text = level._create_masked_text()
        elif self.current_phase == 3:
            # Na fase 3, o usuário precisará digitar todas as palavras sem dicas
            pass
    
    def get_phase_description(self) -> str:
        """Retorna a descrição da fase atual."""
        if self.current_phase == 1:
            return "Fase 1: Selecione as palavras-chave corretas para preencher os espaços."
        elif self.current_phase == 2:
            return "Fase 2: Menos opções disponíveis. Selecione as palavras-chave corretas."
        else:
            return "Fase 3: Digite as palavras-chave sem dicas."
    
    def get_completion_percentage(self) -> float:
        """
        Calcula a porcentagem de conclusão do jogo.
        
        Returns:
            Porcentagem de conclusão (0-100)
        """
        if not self.levels:
            return 0.0
            
        completed = sum(1 for level in self.levels if level.is_completed())
        return (completed / len(self.levels)) * 100