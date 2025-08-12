import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './GameModal.css';

// Tipos de jogos
import FillBlanksGame from './games/FillBlanksGame';
import QuizGame from './games/QuizGame';
import MatchingGame from './games/MatchingGame';
import ReadingGame from './games/ReadingGame';

interface GameData {
  id: number;
  title: string;
  type: 'reading' | 'quiz' | 'fillBlanks' | 'matching';
  content: any; // Conteúdo específico do jogo
}

export const GameModal: React.FC = () => {
  const { resolutionId, missionId } = useParams();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  
  useEffect(() => {
    // Fetch mission data
    fetch(`/api/resolutions/${resolutionId}/missions/${missionId}`)
      .then(res => res.json())
      .then(data => {
        setGameData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching mission data:", err);
        setLoading(false);
      });
  }, [resolutionId, missionId]);
  
  const handleClose = () => {
    navigate(-1);
  };
  
  const handleSkip = () => {
    // Fetch next mission and navigate to it
    fetch(`/api/resolutions/${resolutionId}/missions/${missionId}/next`)
      .then(res => res.json())
      .then(data => {
        if (data.nextMissionId) {
          navigate(`/game/${resolutionId}/${data.nextMissionId}`);
        } else {
          // No more missions, go back to map
          navigate(-1);
        }
      });
  };
  
  const handleComplete = async () => {
    // Mark mission as completed
    await fetch(`/api/resolutions/${resolutionId}/missions/${missionId}/complete`, {
      method: 'POST',
    });
    
    setCompleted(true);
    
    // After a short delay, move to next mission or close
    setTimeout(() => {
      handleSkip();
    }, 2000);
  };
  
  const renderGameComponent = () => {
    if (!gameData) return null;
    
    switch(gameData.type) {
      case 'reading':
        return <ReadingGame content={gameData.content} onComplete={handleComplete} />;
      case 'quiz':
        return <QuizGame questions={gameData.content} onComplete={handleComplete} />;
      case 'fillBlanks':
        return <FillBlanksGame text={gameData.content} onComplete={handleComplete} />;
      case 'matching':
        return <MatchingGame pairs={gameData.content} onComplete={handleComplete} />;
      default:
        return <div>Tipo de jogo não suportado</div>;
    }
  };
  
  if (loading) {
    return (
      <div className="game-modal">
        <div className="game-container">
          <div className="game-loading">
            <div className="spinner"></div>
            <p>Carregando...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="game-modal">
      <div className="game-header">
        <button className="close-btn" onClick={handleClose}>✕</button>
        <h2>{gameData?.title}</h2>
        <button className="skip-btn" onClick={handleSkip}>Pular</button>
      </div>
      
      <div className="game-container">
        {completed ? (
          <div className="completion-message">
            <h2>Parabéns!</h2>
            <p>Você completou esta missão!</p>
            <div className="completion-animation"></div>
          </div>
        ) : (
          renderGameComponent()
        )}
      </div>
    </div>
  );
};