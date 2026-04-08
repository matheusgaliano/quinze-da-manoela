import React from 'react';
import styled from 'styled-components';
import { Play, Pause, SkipForward, Volume2 } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';

const PlayerContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
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
`;

export default function Player() {
    const { isPlaying, togglePlay, currentSong, nextSong } = useAudio();

    if (!currentSong) return null;

    return (
        <PlayerContainer>
            <SongInfo>{currentSong.title}</SongInfo>

            <ControlButton onClick={togglePlay}>
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </ControlButton>

            <ControlButton onClick={nextSong}>
                <SkipForward size={18} />
            </ControlButton>

            <ControlButton>
                <Volume2 size={18} />
            </ControlButton>
        </PlayerContainer>
    );
}