import React from 'react';
import styled from 'styled-components';
import { Play, Pause, SkipForward, Volume2 } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';

const PlayerContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 10px 20px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 1px solid var(--primary);
  z-index: 1000;

  @media (max-width: 768px) {
    bottom: auto; /* Remove do rodapé */
    top: 10px;    /* Fixa no topo com um pequeno recuo */
    left: 50%;
    transform: translateX(-50%);
    width: 90%;   /* Ajusta a largura para não colar nas bordas */
  }
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;
  &:hover { color: var(--accent); }
`;

const SongInfo = styled.span`
  font-size: 12px;
  color: #666;
  margin-right: 5px;
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  input {
    width: 60px;
    cursor: pointer;
    accent-color: var(--primary);
  }
`;

export default function Player() {
    // Importando as novas funções que adicionamos no AudioContext
    const {
        isPlaying,
        togglePlay,
        currentSong,
        nextSong,
        volume,
        handleVolumeChange
    } = useAudio();

    if (!currentSong) return null;

    return (
        <PlayerContainer>
            {/* O título agora muda sozinho quando você clica em Próxima */}
            <SongInfo>{currentSong.title}</SongInfo>

            <ControlButton onClick={togglePlay} title={isPlaying ? "Pausar" : "Tocar"}>
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </ControlButton>

            {/* Botão de próxima música conectado */}
            <ControlButton onClick={nextSong} title="Próxima música">
                <SkipForward size={18} />
            </ControlButton>

            {/* Controle de Volume Funcional */}
            <VolumeContainer>
                <Volume2 size={18} color="#666" />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => handleVolumeChange(e.target.value)}
                />
            </VolumeContainer>
        </PlayerContainer>
    );
}