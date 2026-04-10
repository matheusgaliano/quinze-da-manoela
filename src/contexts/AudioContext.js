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

    // Inicializa o áudio apenas uma vez
    useEffect(() => {
        audioRef.current = new Audio(playlist[0].url);
        audioRef.current.volume = volume;
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
                audioRef.current.play().catch(err => console.error(err));
            }
        }
    };

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(err => console.error(err));
            setIsPlaying(true);
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