import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const Modal = styled.div`
  background: white;
  padding: 40px;
  border-radius: 30px;
  width: 90%;
  max-width: 450px;
  text-align: center;
  position: relative;
`;

const Title = styled.h2`
  font-family: 'Montserrat', sans-serif;
  color: var(--primary);
  margin-bottom: 20px;
`;

const GiftImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 15px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #A57C4B;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  width: 100%;
  transition: background 0.3s;
  margin-bottom: 15px;

  &:hover {
    background-color: #8a653d;
  }
`;

const CancelButton = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  text-decoration: underline;
`;

export default function GiftModal({ gift, onClose, onAddToCart }) {

    const handleConfirm = () => {
        onAddToCart(gift); // Adiciona ao carrinho global no App.js
        onClose(); // Fecha este modal
    };

    return (
        <Overlay onClick={onClose}>
            <Modal onClick={e => e.stopPropagation()}>
                <Title>Deseja presentear com {gift.title}?</Title>

                <GiftImage src={gift.image} alt={gift.title} />

                <p style={{ marginBottom: '25px', color: '#666' }}>
                    Este item será adicionado ao seu carrinho para finalização via Pix.
                </p>

                <Button onClick={handleConfirm}>
                    Adicionar ao Carrinho — R$ {gift.price.toFixed(2)}
                </Button>

                <CancelButton onClick={onClose}>Agora não</CancelButton>
            </Modal>
        </Overlay>
    );
}