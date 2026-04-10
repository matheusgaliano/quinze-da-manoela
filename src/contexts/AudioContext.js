export const AudioProvider = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [volume, setVolume] = useState(0.5); // Inicia em 50%

    const playlist = [
        { id: 1, title: "Way Back Home - Hannah Montana", url: '/assets/musica1.mp3' },
        { id: 2, title: "Quinze - Larissa Manoela", url: '/assets/musica2.mp3' }
    ];

    // Usamos o useRef para o áudio não reiniciar toda vez que o componente renderizar
    const audioRef = useRef(new Audio(playlist[0].url));

    // Sincroniza o volume do objeto de áudio com o estado inicial
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, []);

    const handleVolumeChange = (newVolume) => {
        const v = parseFloat(newVolume);
        setVolume(v);
        if (audioRef.current) {
            audioRef.current.volume = v;
        }
    };

    const nextSong = () => {
        // Calcula o próximo índice (se chegar no fim, volta para a primeira)
        const nextIndex = (currentSongIndex + 1) % playlist.length;
        setCurrentSongIndex(nextIndex);

        // Atualiza a fonte do áudio
        audioRef.current.src = playlist[nextIndex].url;
        audioRef.current.volume = volume;

        // Se já estava tocando, continua tocando a nova música
        if (isPlaying) {
            audioRef.current.play().catch(err => console.error("Erro ao tocar:", err));
        }
    };

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(err => console.error("Erro ao tocar:", err));
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

export const useAudio = () => useContext(AudioContext);