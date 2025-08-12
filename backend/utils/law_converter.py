import re
import json
import os
import markdown

def convert_law_to_markdown(law_text, output_file):
    """Converte o texto de uma lei em formato markdown."""
    # Substitui numeração de artigos, parágrafos, etc.
    md_text = re.sub(r'Art\. (\d+)', r'## Art. \1', law_text)
    md_text = re.sub(r'§ (\d+)º', r'### § \1º', md_text)
    md_text = re.sub(r'(\d+) -', r'\1. ', md_text)
    
    # Adiciona título e data
    title_match = re.search(r'(LEI|RESOLUÇÃO) Nº [\d\.]+, DE [\d\s]+ DE [A-ZÇ]+ DE \d{4}', law_text)
    if title_match:
        title = title_match.group(0)
        md_text = f"# {title}\n\n{md_text}"
    
    # Salva o arquivo markdown
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(md_text)
    
    return output_file

def extract_key_terms(markdown_text):
    """Extrai termos-chave do texto da lei para usar em exercícios."""
    # Termos comuns em leis
    common_terms = ["dispõe", "estabelece", "regulamenta", "autoriza", 
                    "determina", "revoga", "altera", "institui", "cria"]
    
    # Verbos importantes
    important_verbs = []
    for term in common_terms:
        matches = re.findall(r'\b' + term + r'\b', markdown_text.lower())
        important_verbs.extend(matches)
    
    # Substantivos específicos (simplificado)
    specific_nouns = re.findall(r'\b[A-Z][a-zA-Z]{7,}\b', markdown_text)
    
    return {
        "verbs": list(set(important_verbs)),
        "nouns": list(set(specific_nouns[:20]))  # Limita a 20 substantivos
    }

def generate_fill_blanks_game(article_text, key_terms):
    """Gera um jogo de preencher lacunas baseado em um artigo da lei."""
    # Substitui alguns termos-chave por lacunas
    blanks = []
    segments = []
    
    # Combina verbos e substantivos
    all_terms = key_terms["verbs"] + key_terms["nouns"]
    
    # Escolhe até 5 termos para substituir
    terms_to_replace = all_terms[:min(5, len(all_terms))]
    
    current_text = article_text
    for term in terms_to_replace:
        # Encontra a primeira ocorrência do termo
        term_pattern = re.escape(term)
        match = re.search(r'\b' + term_pattern + r'\b', current_text, re.IGNORECASE)
        if match:
            start, end = match.span()
            segments.append(current_text[:start])
            blanks.append(term)
            current_text = current_text[end:]
    
    # Adiciona o texto restante
    segments.append(current_text)
    
    # Cria opções (termos corretos + alguns distratores)
    options = blanks.copy()
    # Adiciona alguns distratores similares
    distractors = ["aprovar", "sancionar", "vetar", "promulgar", "publicar", 
                   "Conselho", "Assembleia", "Governo", "Administração"]
    options.extend(distractors[:min(5, len(distractors))])
    
    return {
        "segments": segments,
        "blanks": blanks,
        "options": options
    }

def create_missions_from_law(law_file, resolution_id):
    """Cria missões de aprendizado a partir de um arquivo de lei."""
    with open(law_file, 'r', encoding='utf-8') as f:
        law_text = f.read()
    
    # Extrai termos-chave
    key_terms = extract_key_terms(law_text)
    
    # Divide o texto em artigos
    articles = re.split(r'## Art\.', law_text)
    
    missions = []
    
    # Primeira missão: leitura da introdução
    if len(articles) > 0:
        intro = articles[0]
        missions.append({
            "resolution_id": resolution_id,
            "title": "Introdução",
            "description": "Leia a introdução da lei",
            "order": 1,
            "type": "reading",
            "content": {"text": intro, "minReadTime": 30},  # 30 segundos mínimos
            "completed": False,
            "locked": False
        })
    
    # Para cada artigo, cria uma missão de leitura e uma de jogo
    order = 2
    for i, article in enumerate(articles[1:6]):  # Limitamos a 5 artigos para este exemplo
        article_text = f"Art. {article}"
        
        # Missão de leitura
        missions.append({
            "resolution_id": resolution_id,
            "title": f"Artigo {i+1}",
            "description": f"Estude o Artigo {i+1}",
            "order": order,
            "type": "reading",
            "content": {"text": article_text, "minReadTime": 20},
            "completed": False,
            "locked": i > 0  # Primeiro artigo desbloqueado, os outros bloqueados
        })
        order += 1
        
        # Missão de preencher lacunas
        fill_blanks_game = generate_fill_blanks_game(article_text, key_terms)
        missions.append({
            "resolution_id": resolution_id,
            "title": f"Teste - Artigo {i+1}",
            "description": f"Complete o texto do Artigo {i+1}",
            "order": order,
            "type": "fillBlanks",
            "content": fill_blanks_game,
            "completed": False,
            "locked": True
        })
        order += 1
    
    return missions