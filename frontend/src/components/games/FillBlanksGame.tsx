import React, { useState, useEffect } from 'react';
import './FillBlanksGame.css';

interface FillBlanksGameProps {
  text: {
    segments: string[];
    blanks: string[];
    options: string[];
  };
  onComplete: () => void;
}

const FillBlanksGame: React.FC<FillBlanksGameProps> = ({ text, onComplete }) => {
  const [answers, setAnswers] = useState<string[]>(Array(text.blanks.length).fill(''));
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [availableOptions, setAvailableOptions] = useState<string[]>([...text.options]);
  
  // Embaralha as opções no início
  useEffect(() => {
    setAvailableOptions(shuffleArray([...text.options]));
  }, [text.options]);
  
  const shuffleArray = (array: string[]): string[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  const handleOptionClick = (option: string) => {
    const emptyIndex = answers.findIndex(a => a === '');
    if (emptyIndex !== -1) {
      const newAnswers = [...answers];
      newAnswers[emptyIndex] = option;
      setAnswers(newAnswers);
      
      // Remove da lista de opções disponíveis
      setAvailableOptions(availableOptions.filter(o => o !== option));
      
      // Verifica se todas as lacunas foram preenchidas
      if (newAnswers.every(a => a !== '')) {
        checkAnswers(newAnswers);
      }
    }
  };
  
  const handleBlankClick = (index: number) => {
    if (answers[index] !== '') {
      // Devolve a opção para a lista disponível
      setAvailableOptions([...availableOptions, answers[index]]);
      
      // Remove da resposta
      const newAnswers = [...answers];
      newAnswers[index] = '';
      setAnswers(newAnswers);
      setIsCorrect(null);
    }
  };
  
  const checkAnswers = (currentAnswers: string[]) => {
    const correct = currentAnswers.every((answer, index) => 
      answer.toLowerCase() === text.blanks[index].toLowerCase()
    );
    
    setIsCorrect(correct);
    
    if (correct) {
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  };
  
  const renderText = () => {
    return (
      <div className="fill-blanks-text">
        {text.segments.map((segment, index) => (
          <React.Fragment key={index}>
            <span>{segment}</span>
            {index < text.blanks.length && (
              <span 
                className={`fill-blank ${answers[index] ? 'filled' : ''} ${
                  isCorrect === false && answers[index] ? 'incorrect' : ''
                } ${isCorrect && answers[index] ? 'correct' : ''}`}
                onClick={() => handleBlankClick(index)}
              >
                {answers[index] || '_____'}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };
  
  return (
    <div className="fill-blanks-game">
      <div className="game-instructions">
        <p>Complete o texto da lei selecionando as palavras corretas:</p>
      </div>
      
      {renderText()}
      
      <div className="options-container">
        {availableOptions.map((option, index) => (
          <button 
            key={index} 
            className="option-button"
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </button>
        ))}
      </div>
      
      {isCorrect === true && (
        <div className="feedback correct">
          <span>✓</span> Correto!
        </div>
      )}
      
      {isCorrect === false && (
        <div className="feedback incorrect">
          <span>✗</span> Tente novamente!
          <button 
            className="retry-button"
            onClick={() => {
              setAnswers(Array(text.blanks.length).fill(''));
              setAvailableOptions(shuffleArray([...text.options]));
              setIsCorrect(null);
            }}
          >
            Recomeçar
          </button>
        </div>
      )}
    </div>
  );
};

export default FillBlanksGame;