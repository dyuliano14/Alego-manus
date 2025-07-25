// frontend/src/App.jsx import React, { useEffect, useState } from 'react'; import './App.css';

const API_TIME_URL = "http://worldtimeapi.org/api/timezone/America/Sao_Paulo";

export default function App() { const [now, setNow] = useState(null); const [programStart, setProgramStart] = useState(""); const [duration, setDuration] = useState(""); const [paused, setPaused] = useState(false); const [timeLeft, setTimeLeft] = useState(null); const [intervalId, setIntervalId] = useState(null);

const fetchCurrentTime = async () => { const response = await fetch(API_TIME_URL); const data = await response.json(); setNow(new Date(data.datetime)); };

const startProgram = () => { if (!programStart || !duration) return;

const start = new Date(programStart);
const dur = parseInt(duration);
const end = new Date(start.getTime() + dur * 60000);

const tick = () => {
  if (paused) return;
  const diff = end - new Date();
  if (diff <= 0) {
    clearInterval(intervalId);
    setTimeLeft("00:00");
  } else {
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    setTimeLeft(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
  }
};

tick();
const id = setInterval(tick, 1000);
setIntervalId(id);

};

useEffect(() => { fetchCurrentTime(); }, []);

return ( <main className="min-h-screen bg-zinc-900 text-white p-4"> <h1 className="text-2xl font-bold mb-4">Diretor de Programa - Roteiro Ao Vivo</h1> <div className="mb-4"> <label className="block">Hora de Início do Programa:</label> <input type="datetime-local" className="text-black p-2" value={programStart} onChange={e => setProgramStart(e.target.value)} /> </div> <div className="mb-4"> <label className="block">Duração total (minutos):</label> <input type="number" className="text-black p-2" value={duration} onChange={e => setDuration(e.target.value)} /> </div> <div className="mb-4"> <button onClick={startProgram} className="bg-green-600 px-4 py-2 mr-2">Iniciar</button> <button onClick={() => setPaused(!paused)} className="bg-yellow-600 px-4 py-2"> {paused ? 'Retomar' : 'Pausar'} </button> </div> <div className="text-3xl font-mono"> Tempo Restante: {timeLeft ?? '--:--'} </div> </main> ); }

