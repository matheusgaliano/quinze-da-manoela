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
  z-index: 3000;
`;

const Modal = styled.div`
  background: white;
  padding: 30px;
  border-radius: 25px;
  width: 95%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
`;

const QtyControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  button {
    background: #f0f0f0;
    border: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    &:hover { background: #e0e0e0; }
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ff4d4d;
  cursor: pointer;
  font-size: 0.8rem;
  margin-top: 5px;
  text-decoration: underline;
`;

const TotalSection = styled.div`
  margin: 20px 0;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 15px;
  text-align: center;
  
  h3 { color: #A57C4B; font-size: 1.5rem; }
`;

const Button = styled.button`
  background-color: #25d366; // Cor do WhatsApp
  color: white;
  border: none;
  padding: 15px;
  border-radius: 50px;
  width: 100%;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
`;

export default function CartModal({ itens, onClose, onUpdateCart }) {
    // onUpdateCart é uma função que vamos passar do App.js para atualizar o estado global

    const total = itens.reduce((acc, item) => acc + (item.price * item.quantidade), 0);

    const alterarQuantidade = (id, delta) => {
        const novosItens = itens.map(item => {
            if (item.id === id) {
                const novaQty = Math.max(1, item.quantidade + delta);
                return { ...item, quantidade: novaQty };
            }
            return item;
        });
        onUpdateCart(novosItens);
    };

    const removerItem = (id) => {
        const novosItens = itens.filter(item => item.id !== id);
        onUpdateCart(novosItens);
        if (novosItens.length === 0) onClose();
    };

    return (
        <Overlay onClick={onClose}>
            <Modal onClick={e => e.stopPropagation()}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Seu Carrinho 🎁</h2>

                {itens.map(item => (
                    <ItemRow key={item.id}>
                        <div style={{ flex: 1 }}>
                            <strong style={{ display: 'block' }}>{item.title}</strong>
                            <small>R$ {item.price.toFixed(2)} / un</small>
                            <br />
                            <RemoveButton onClick={() => removerItem(item.id)}>Remover</RemoveButton>
                        </div>

                        <QtyControls>
                            <button onClick={() => alterarQuantidade(item.id, -1)}>-</button>
                            <span>{item.quantidade}</span>
                            <button onClick={() => alterarQuantidade(item.id, 1)}>+</button>
                        </QtyControls>
                    </ItemRow>
                ))}

                <TotalSection>
                    <p>Total a pagar:</p>
                    <h3>R$ {total.toFixed(2)}</h3>
                </TotalSection>

                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>Chave Pix (Celular):</p>
                    <strong style={{ fontSize: '1.1rem' }}>55999810295</strong>
                </div>

                <Button onClick={() => window.open(`https://wa.me/55999810295?text=Olá Manu! Estou enviando um presente: ${itens.map(i => `${i.quantidade}x ${i.title}`).join(', ')}. Total: R$ ${total.toFixed(2)}`, '_blank')}>
                    JÁ FIZ O PIX, AVISAR MANU
                </Button>

                <button
                    onClick={onClose}
                    style={{ background: 'none', border: 'none', width: '100%', marginTop: '15px', cursor: 'pointer', color: '#999' }}
                >
                    Continuar Escolhendo
                </button>
            </Modal>
        </Overlay>
    );
}