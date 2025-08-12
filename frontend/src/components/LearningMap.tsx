import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LearningMap.css';

interface Mission {
  id: number;
  title: string;
  description: string;
  type: 'reading' | 'quiz' | 'fillBlanks' | 'matching';
  completed: boolean;
  locked: boolean;
  contentId: number;
}

interface LearningMapProps {
  resolutionId: number;
  title: string;
}

export const LearningMap: React.FC<LearningMapProps> = ({ resolutionId, title }) => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Fetch missions for this resolution
    fetch(`/api/resolutions/${resolutionId}/missions`)
      .then(res => res.json())
      .then(data => {
        setMissions(data);
        calculateProgress(data);
      });
  }, [resolutionId]);
  
  const calculateProgress = (missionData: Mission[]) => {
    const completed = missionData.filter(m => m.completed).length;
    setProgress(Math.round((completed / missionData.length) * 100));
  };
  
  const startMission = (mission: Mission) => {
    if (mission.locked) return;
    
    // Open the game modal with the selected mission
    navigate(`/game/${resolutionId}/${mission.id}`);
  };
  
  return (
    <div className="learning-map-container">
      <div className="learning-map-header">
        <h1>{title}</h1>
        <div className="progress-container">
          <div className="progress-circle">
            <svg viewBox="0 0 36 36">
              <path
                className="progress-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="progress-fill"
                strokeDasharray={`${progress}, 100`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="progress-text">{progress}%</span>
          </div>
        </div>
      </div>
      
      <div className="missions-path">
        {missions.map((mission, index) => (
          <div 
            key={mission.id} 
            className={`mission-node ${mission.completed ? 'completed' : ''} ${mission.locked ? 'locked' : ''}`}
            onClick={() => startMission(mission)}
          >
            <div className="mission-icon">
              {mission.completed ? '✓' : (mission.locked ? '🔒' : index + 1)}
            </div>
            <div className="mission-info">
              <h3>{mission.title}</h3>
              <p>{mission.description}</p>
            </div>
            {index < missions.length - 1 && <div className="mission-connector"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};