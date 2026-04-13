import React, { useState } from 'react';
import styled from 'styled-components';
import GlobalStyle from './GlobalStyle';
import { AudioProvider, useAudio } from './contexts/AudioContext';
import Player from './components/Player';
import GiftCard from './components/GiftCard';
import WelcomeModal from './components/WelcomeModal';
// Importamos o novo componente que você vai criar agora
import AdminMessages from './components/AdminMessages';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
`;

const gifts = [
    { id: 1, title: "Museu do Louvre", price: 100.00, description: "Uma imersão na arte e história no museu mais famoso do mundo.", image: "louvre.jpg" },
    { id: 2, title: "Disney Paris", price: 500.00, description: "Um dia mágico no reino encantado para celebrar os 15 anos.", image: "disney.jpg" },
    { id: 3, title: "Opera Garnier", price: 200.00, description: "Beleza e arquitetura em um dos teatros mais luxuosos de Paris.", image: "opera.jpg" },
    { id: 4, title: "Catedral de Notre-Dame", price: 100.00, description: "Visita a um dos maiores símbolos da arquitetura gótica.", image: "notredame.jpg" },
    { id: 5, title: "Moulin Rouge", price: 500.00, description: "Uma noite inesquecível no cabaré mais icônico do mundo.", image: "moulin.jpg" },
    { id: 6, title: "Passeio Rio Sena", price: 200.00, description: "Cruzeiro romântico pelas águas que cortam o coração de Paris.", image: "sena.jpg" },
    { id: 8, title: "Visita Panorâmica Paris", price: 200.00, description: "Tour completo para ver a Cidade Luz de todos os ângulos.", image: "panoramica.jpg" },
    { id: 9, title: "Topo Torre Eiffel", price: 300.00, description: "A vista mais alta e emocionante da capital francesa.", image: "torre.jpg" },
    { id: 10, title: "Passeio Champs-Élysées", price: 100.00, description: "Caminhada pela avenida mais charmosa e luxuosa do mundo.", image: "champs.jpg" },
    { id: 11, title: "Palácio de Versalhes", price: 200.00, description: "Um dia de realeza conhecendo os jardins e o salão dos espelhos.", image: "versalhes.jpg" },
    { id: 12, title: "Arco do Triunfo & Galeries Lafayette", price: 100.00, description: "História e as melhores vitrines de moda de Paris.", image: "galeries.jpg" },
    { id: 13, title: "Café de Flore", price: 100.00, description: "Um clássico café parisiense para viver como uma local.", image: "flore.jpg" },
    { id: 14, title: "Ponte Alexandre III", price: 100.00, description: "Fotos inesquecíveis na ponte mais ornamentada de Paris.", image: "ponte.jpg" },
    { id: 15, title: "Um dia de princesa em Paris", price: 1000.00, description: "Um dia de princesa em Paris que ficará marcado em minha memória como um dos momentos mais especiais.", image: "princesa.jpg" }
];

function MainContent() {
    const [showWelcome, setShowWelcome] = useState(true);
    const { togglePlay } = useAudio();

    const handleAccept = () => {
        togglePlay();
        setShowWelcome(false);
    };

    return (
        <>
            {showWelcome && (
                <WelcomeModal
                    onAccept={handleAccept}
                    onDecline={() => setShowWelcome(false)}
                />
            )}

            <Player />

            <Container>
                <h2 style={{
                    fontWeight: '250',
                    fontSize: '5rem',
                    color: 'var(--secondary-dark)',
                    textAlign: 'center',
                    marginBottom: '60px'
                }}>
                    Lista de Presentes da Manoela
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                    {gifts.map(gift => (
                        <GiftCard key={gift.id} gift={gift} />
                    ))}
                </div>
            </Container>
        </>
    );
}

function App() {
    const [isAdmin, setIsAdmin] = useState(false);

    return (
        <AudioProvider>
            <GlobalStyle />

            {isAdmin ? (
                /* Se estiver logado, mostra as mensagens */
                <AdminMessages onBack={() => setIsAdmin(false)} />
            ) : (
                /* Se não, mostra o site normal */
                <>
                    <MainContent />

                    {/* Botão Secreto no rodapé */}
                    <footer
                        onClick={() => {
                            const pass = prompt("Chave de acesso da Manu:");
                            if (pass === "mano15") setIsAdmin(true);
                        }}
                        style={{
                            textAlign: 'center',
                            padding: '40px',
                            cursor: 'pointer',
                            opacity: 0.1, // Quase invisível
                            fontSize: '10px'
                        }}
                    >
                        .
                    </footer>
                </>
            )}
        </AudioProvider>
    );
}

export default App;