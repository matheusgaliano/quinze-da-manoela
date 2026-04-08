import React from 'react';
import styled from 'styled-components';

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

const Content = styled.div`
  padding: 40px;
  max-width: 500px;
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
            <Content>
                <Title>Bem-vindo aos 15 Anos da Manu</Title>
                <p><i>Célébrer mes 15 ans à Paris</i></p>

                <p>Gostaria de acompanhar sua visita com a trilha sonora especial da Manu?</p>
                <ButtonGroup>
                    <ActionButton className="yes" onClick={onAccept}>
                        Sim, tocar música! 🎵
                    </ActionButton>
                    <ActionButton className="no" onClick={onDecline}>
                        Agora não
                    </ActionButton>
                </ButtonGroup>
            </Content>
        </Overlay>
    );
}