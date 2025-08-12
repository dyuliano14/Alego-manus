import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LearningMap } from './components/LearningMap';
import { GameModal } from './components/GameModal';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas existentes */}
        
        {/* Novas rotas para o sistema gamificado */}
        <Route path="/learning/:resolutionId" element={
          <Layout>
            <LearningMap />
          </Layout>
        } />
        
        <Route path="/game/:resolutionId/:missionId" element={
          <GameModal />
        } />
        
        {/* ... */}
      </Routes>
    </Router>
  );
}

export default App;