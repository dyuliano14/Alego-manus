import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../services/api';

interface HealthStatus {
  status: string;
  database: string;
  env: string;
  python?: string;
  timestamp?: string;
}

interface Curso {
  id: number;
  nome: string;
  descricao: string;
  created_at: string;
}

export default function TestePage() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testBackendConnection();
  }, []);

  const testBackendConnection = async () => {
    const testResults: string[] = [];
    
    try {
      // Teste 1: Health Check
      console.log('🔍 Testando health check...');
      const healthUrl = getApiUrl('/api/debug/health');
      console.log('Health URL:', healthUrl);
      
      const healthResponse = await fetch(healthUrl);
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        setHealthStatus(healthData);
        console.log('✅ Health check OK:', healthData);
      } else {
        testResults.push(`❌ Health check falhou: ${healthResponse.status}`);
      }

      // Teste 2: Lista de Cursos
      console.log('🔍 Testando lista de cursos...');
      const cursosUrl = getApiUrl('/api/cursos');
      console.log('Cursos URL:', cursosUrl);
      
      const cursosResponse = await fetch(cursosUrl);
      if (cursosResponse.ok) {
        const cursosData = await cursosResponse.json();
        setCursos(cursosData);
        console.log('✅ Cursos carregados:', cursosData);
      } else {
        testResults.push(`❌ Lista de cursos falhou: ${cursosResponse.status}`);
      }

    } catch (error) {
      console.error('❌ Erro na comunicação:', error);
      testResults.push(`❌ Erro: ${error}`);
    }

    setErrors(testResults);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-blue-600">🧪 Teste de Comunicação Frontend ↔ Backend</h1>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <p className="text-yellow-800">⏳ Testando comunicação com o backend...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">🧪 Teste de Comunicação Frontend ↔ Backend</h1>
        
        {/* Status da Saúde */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-green-600">🏥 Status do Backend</h2>
          {healthStatus ? (
            <div className="space-y-2">
              <p><strong>Status:</strong> <span className={`px-2 py-1 rounded ${healthStatus.status === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{healthStatus.status}</span></p>
              <p><strong>Banco de Dados:</strong> <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{healthStatus.database}</span></p>
              <p><strong>Ambiente:</strong> <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">{healthStatus.env}</span></p>
              {healthStatus.python && <p><strong>Python:</strong> {healthStatus.python}</p>}
              {healthStatus.timestamp && <p><strong>Timestamp:</strong> {healthStatus.timestamp}</p>}
            </div>
          ) : (
            <p className="text-red-600">❌ Não foi possível conectar ao health check</p>
          )}
        </div>

        {/* Lista de Cursos */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">📚 Dados dos Cursos</h2>
          {cursos.length > 0 ? (
            <div className="space-y-3">
              {cursos.map((curso) => (
                <div key={curso.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-lg">{curso.nome}</h3>
                  <p className="text-gray-600">{curso.descricao}</p>
                  <p className="text-sm text-gray-500">ID: {curso.id} | Criado em: {new Date(curso.created_at).toLocaleString('pt-BR')}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-yellow-600">⚠️ Nenhum curso encontrado</p>
          )}
        </div>

        {/* Configurações */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-purple-600">⚙️ Configurações</h2>
          <div className="space-y-2">
            <p><strong>API Base URL:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{import.meta.env.VITE_API_URL || 'Não definida'}</code></p>
            <p><strong>Ambiente:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{import.meta.env.VITE_ENVIRONMENT || 'Não definido'}</code></p>
            <p><strong>URL Health:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{getApiUrl('/api/debug/health')}</code></p>
            <p><strong>URL Cursos:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{getApiUrl('/api/cursos')}</code></p>
          </div>
        </div>

        {/* Erros */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-600">❌ Erros Encontrados</h2>
            <ul className="space-y-2">
              {errors.map((error, index) => (
                <li key={index} className="text-red-700">{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Botão de Reteste */}
        <div className="text-center mt-6">
          <button 
            onClick={() => {
              setLoading(true);
              setErrors([]);
              testBackendConnection();
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Testar Novamente
          </button>
        </div>
      </div>
    </div>
  );
}
