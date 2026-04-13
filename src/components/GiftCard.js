import React, { useState } from 'react';
import styled from 'styled-components';
import GiftModal from './GiftModal';

const Card = styled.div`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  transition: transform 0.3s ease;
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 20px;
  text-align: center;
  flex-grow: 1;
`;

const Title = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 15px;
  margin-bottom: 10px;
  color: var(--primary);
`;

const Price = styled.p`
  font-weight: bold;
  color: var(--accent, #A57C4B);
  margin-bottom: 15px;
`;

const Button = styled.button`
  background-color: #A57C4B;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
  
  &:hover {
    background-color: #8a653d;
  }
`;

export default function GiftCard({ gift, onAddToCart }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Card>
                <Image src={gift.image} alt={gift.title} />
                <Content>
                    <Title>{gift.title}</Title>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                        {gift.description}
                    </p>
                    <Price>R$ {gift.price.toFixed(2)}</Price>
                    <Button onClick={() => setIsModalOpen(true)}>Presentear</Button>
                </Content>
            </Card>

            {isModalOpen && (
                <GiftModal
                    gift={gift}
                    onClose={() => setIsModalOpen(false)}
                    // Passamos a função que veio do App.js para dentro do GiftModal
                    onAddToCart={onAddToCart}
                />
            )}
        </>
    );
}