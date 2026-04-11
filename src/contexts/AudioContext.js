import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [volume, setVolume] = useState(0.5);

    const playlist = [
        { id: 1, title: "Way Back Home - Hannah Montana", url: '/assets/musica1.mp3' },
        { id: 2, title: "Quinze - Larissa Manoela", url: '/assets/musica2.mp3' }
    ];

    const audioRef = useRef(null);

    // Inicializa o objeto de áudio apenas uma vez no carregamento
    useEffect(() => {
        audioRef.current = new Audio(playlist[currentSongIndex].url);
        audioRef.current.volume = volume;

        // Listener para mudar de música automaticamente quando uma acabar
        audioRef.current.onended = () => nextSong();

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const handleVolumeChange = (newVolume) => {
        const v = parseFloat(newVolume);
        setVolume(v);
        if (audioRef.current) {
            audioRef.current.volume = v;
        }
    };

    const nextSong = () => {
        const nextIndex = (currentSongIndex + 1) % playlist.length;
        setCurrentSongIndex(nextIndex);
        if (audioRef.current) {
            audioRef.current.src = playlist[nextIndex].url;
            audioRef.current.volume = volume;
            if (isPlaying) {
                audioRef.current.play().catch(err => console.error("Erro ao tocar próxima:", err));
            }
        }
    };

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(err => console.error("Erro ao dar play:", err));
        }
    };

    return (
        <AudioContext.Provider value={{
            isPlaying,
            togglePlay,
            nextSong,
            volume,
            handleVolumeChange,
            currentSong: playlist[currentSongIndex],
            playlist
        }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio deve ser usado dentro de um AudioProvider');
    }
    return context;
};