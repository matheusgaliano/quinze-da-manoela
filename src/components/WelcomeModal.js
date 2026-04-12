import React from 'react';
import styled from 'styled-components';

// Importando as imagens conforme os nomes que você passou
import manuImg from '../assets/manu.jpeg';
import manuTorreImg from '../assets/manu-torre.jpeg';

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  text-align: center;
`;

// Novo container para organizar as fotos e o texto em colunas
const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const Content = styled.div`
  padding: 40px;
  max-width: 500px;
  flex-shrink: 0;
`;

// Estilo para as fotos laterais
const SideImage = styled.img`
  width: 100%;
  max-width: 280px;
  height: auto;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  object-fit: cover;

  @media (max-width: 768px) {
    display: none; /* Esconde no celular para não empilhar muita coisa */
  }
`;

const Title = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-size: 2.5rem;
  color: var(--primary);
  margin-bottom: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
`;

const ActionButton = styled.button`
  padding: 12px 25px;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;
  
  &.yes {
    background: var(--secondary-dark);
    color: white;
  }
  
  &.no {
    background: #eee;
    color: #666;
  }

  &:hover {
    opacity: 0.8;
  }
`;

export default function WelcomeModal({ onAccept, onDecline }) {
    return (
        <Overlay>
            <FlexContainer>
                {/* Foto da Esquerda */}
                <SideImage src={manuImg} alt="Manu" />

                <Content>
                    <Title>Bem-vindo à lista de presentes dos meus 15 anos.</Title>
                    <p><i>Célébrer mes 15 ans à Paris</i></p>
                    <p>Gostaria de acompanhar sua visita com a trilha sonora especial da Mano?</p>
                    <ButtonGroup>
                        <ActionButton className="yes" onClick={onAccept}>
                            Sim, tocar música! 🎵
                        </ActionButton>
                        <ActionButton className="no" onClick={onDecline}>
                            Agora não
                        </ActionButton>
                    </ButtonGroup>
                </Content>

                {/* Foto da Direita */}
                <SideImage src={manuTorreImg} alt="Manu na Torre" />
            </FlexContainer>
        </Overlay>
    );
}