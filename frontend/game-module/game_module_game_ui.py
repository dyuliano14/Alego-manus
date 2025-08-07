import streamlit as st
import os
import random
from game_module.extractor import PDFExtractor
from game_module.game_engine import GameEngine

def load_game_css():
    """Carrega estilos CSS personalizados para o jogo."""
    st.markdown("""
    <style>
    .keyword-button {
        margin: 5px;
        padding: 8px 16px;
        border-radius: 4px;
        background-color: #4CAF50;
        color: white;
        border: none;
        cursor: pointer;
    }
    
    .keyword-button:hover {
        background-color: #45a049;
    }
    
    .blank {
        border-bottom: 2px solid #333;
        padding: 0 4px;
        margin: 0 2px;
        display: inline-block;
    }
    
    .highlight {
        background-color: #ffff99;
        padding: 0 2px;
    }
    
    .article-box {
        border: 1px solid #ddd;
        padding: 15px;
        border-radius: 5px;
        margin-bottom: 20px;
        background-color: #f9f9f9;
    }
    
    .phase-indicator {
        font-size: 18px;
        font-weight: bold;
        color: #2471A3;
        margin-bottom: 20px;
    }
    
    .progress-bar {
        height: 20px;
        background-color: #e0e0e0;
        border-radius: 10px;
        margin-bottom: 20px;
    }
    
    .progress-fill {
        height: 100%;
        background-color: #4CAF50;
        border-radius: 10px;
        text-align: center;
        line-height: 20px;
        color: white;
    }
    </style>
    """, unsafe_allow_html=True)

def format_text_with_blanks(text, keywords):
    """
    Formata o texto substituindo palavras-chave por espaços em branco.
    
    Args:
        text: Texto original
        keywords: Lista de palavras-chave a serem substituídas
        
    Returns:
        Texto formatado com HTML para mostrar espaços em branco
    """
    formatted_text = text
    for keyword in keywords:
        blank = f'<span class="blank">{"_" * len(keyword)}</span>'
        formatted_text = formatted_text.replace(keyword, blank)
    return formatted_text

def render_game_page():
    """Renderiza a página do jogo, pode ser chamada da página principal."""
    st.title("Aprendizado Interativo de Legislação")
    
    load_game_css()
    
    # Inicialização da sessão
    if 'game_engine' not in st.session_state:
        # Lista de PDFs disponíveis
        pdf_options = ["Resolução 1.218", "Lei Orgânica", "Regimento Interno", "Estatuto dos Servidores"]
        selected_pdf = st.selectbox("Selecione o documento de legislação:", pdf_options)
        
        # Mapeamento dos PDFs para seus caminhos reais
        pdf_paths = {
            "Resolução 1.218": "data/resolucao_1218.pdf",
            "Lei Orgânica": "data/lei_organica.pdf",
            "Regimento Interno": "data/regimento_interno.pdf",
            "Estatuto dos Servidores": "data/estatuto_servidores.pdf"
        }
        
        pdf_path = pdf_paths.get(selected_pdf, "data/resolucao_1218.pdf")
        
        if st.button("Iniciar Jogo"):
            with st.spinner("Carregando documento e inicializando jogo..."):
                try:
                    extractor = PDFExtractor(pdf_path)
                    st.session_state.game_engine = GameEngine(extractor)
                    st.session_state.game_engine.initialize_game()
                    st.session_state.selected_keyword_index = None
                    st.session_state.correct_answers = 0
                    st.session_state.total_questions = 0
                except Exception as e:
                    st.error(f"Erro ao inicializar o jogo: {str(e)}")
    else:
        game_engine = st.session_state.game_engine
        current_level = game_engine.get_current_level()
        
        if current_level:
            # Mostrar descrição da fase
            st.markdown(f'<div class="phase-indicator">{game_engine.get_phase_description()}</div>', 
                        unsafe_allow_html=True)
            
            # Mostrar barra de progresso
            progress = game_engine.get_completion_percentage()
            st.markdown(f"""
            <div class="progress-bar">
                <div class="progress-fill" style="width: {progress}%;">{progress:.1f}%</div>
            </div>
            """, unsafe_allow_html=True)
            
            # Mostrar artigo atual
            st.markdown(f'<div class="article-box"><h3>{current_level.article_id}</h3>', 
                        unsafe_allow_html=True)
            
            if game_engine.current_phase == 1 or game_engine.current_phase == 2:
                # Fases 1 e 2: Mostrar texto com espaços em branco e botões para seleção
                formatted_text = format_text_with_blanks(current_level.original_text, current_level.keywords)
                st.markdown(f"{formatted_text}</div>", unsafe_allow_html=True)
                
                # Mostrar opções de palavras-chave como botões
                st.write("Selecione as palavras-chave:")
                
                # Organizar botões em colunas
                cols = st.columns(3)
                
                # Embaralhar as palavras-chave para não dar dicas pela ordem
                keywords_to_show = current_level.keywords.copy()
                random.shuffle(keywords_to_show)
                
                for i, keyword in enumerate(keywords_to_show):
                    col_idx = i % 3
                    if cols[col_idx].button(keyword, key=f"btn_{i}"):
                        st.session_state.selected_keyword_index = i
                        
                if st.session_state.selected_keyword_index is not None:
                    selected_keyword = keywords_to_show[st.session_state.selected_keyword_index]
                    
                    # Verificar se a resposta está entre as palavras-chave do nível
                    if selected_keyword in current_level.keywords:
                        st.success(f"Correto! '{selected_keyword}' é uma palavra-chave neste artigo.")
                        st.session_state.correct_answers += 1
                    else:
                        st.error(f"Incorreto. '{selected_keyword}' não é uma palavra-chave neste artigo.")
                    
                    st.session_state.total_questions += 1
                    st.session_state.selected_keyword_index = None
                    
            elif game_engine.current_phase == 3:
                # Fase 3: Texto com espaços em branco e campos para digitação
                formatted_text = format_text_with_blanks(current_level.original_text, current_level.keywords)
                st.markdown(f"{formatted_text}</div>", unsafe_allow_html=True)
                
                # Campo para o usuário digitar a palavra
                user_input = st.text_input("Digite a palavra-chave:")
                
                if st.button("Verificar"):
                    # Verificar se a entrada do usuário corresponde a alguma palavra-chave
                    if user_input.lower() in [k.lower() for k in current_level.keywords]:
                        st.success(f"Correto! '{user_input}' é uma palavra-chave neste artigo.")
                        st.session_state.correct_answers += 1
                    else:
                        st.error(f"Incorreto. '{user_input}' não é uma palavra-chave deste artigo.")
                    
                    st.session_state.total_questions += 1
            
            # Botão para avançar para o próximo nível
            if st.button("Próximo Artigo"):
                current_level.mark_completed()
                has_next = game_engine.advance_level()
                if not has_next:
                    st.session_state.game_completed = True
                st.experimental_rerun()
                
        elif hasattr(st.session_state, 'game_completed'):
            # Jogo concluído
            st.success("Parabéns! Você completou todas as fases do jogo!")
            accuracy = 0
            if st.session_state.total_questions > 0:
                accuracy = (st.session_state.correct_answers / st.session_state.total_questions) * 100
                
            st.write(f"Sua taxa de acerto: {accuracy:.1f}%")
            st.write(f"Respostas corretas: {st.session_state.correct_answers}")
            st.write(f"Total de questões: {st.session_state.total_questions}")
            
            if st.button("Reiniciar Jogo"):
                # Limpar o estado da sessão para reiniciar
                for key in list(st.session_state.keys()):
                    if key.startswith('game_'):
                        del st.session_state[key]
                del st.session_state['selected_keyword_index']
                del st.session_state['correct_answers']
                del st.session_state['total_questions']
                if 'game_completed' in st.session_state:
                    del st.session_state['game_completed']
                st.experimental_rerun()
        else:
            st.error("Não há mais níveis disponíveis.")
            if st.button("Reiniciar Jogo"):
                for key in list(st.session_state.keys()):
                    if key.startswith('game_'):
                        del st.session_state[key]
                st.experimental_rerun()