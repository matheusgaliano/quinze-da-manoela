import React, { createContext, useContext, useState, useRef } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);

    const playlist = [
        { id: 1, title: 'Música 1', url: '/assets/musica1.mp3' },
        { id: 2, title: 'Música 2', url: '/assets/musica2.mp3' }
    ];

    // IMPORTANTE: Garantir que o áudio comece com a URL da primeira música
    const audioRef = useRef(new Audio(playlist[0].url));

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.volume = 0;
            audioRef.current.play();
            setIsPlaying(true);

            const targetVolume = 0.5;
            const duration = 3000;
            const interval = 100;
            const step = targetVolume / (duration / interval);

            const fadeIn = setInterval(() => {
                if (audioRef.current && audioRef.current.volume < targetVolume) {
                    audioRef.current.volume = Math.min(audioRef.current.volume + step, targetVolume);
                } else {
                    clearInterval(fadeIn);
                }
            }, interval);
        }
    };

    return (
        <AudioContext.Provider value={{
            isPlaying,
            togglePlay,
            currentSong: playlist[currentSongIndex], // Entrega a música atual
            playlist
        }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => useContext(AudioContext);