import React, { useState } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
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
  max-height: 95vh;
  overflow-y: auto;
  position: relative;
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
`;

const QtyControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  button {
    background: #f0f0f0; border: none; width: 28px; height: 28px;
    border-radius: 50%; cursor: pointer; font-weight: bold;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 10px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 10px;
  height: 80px;
`;

const Button = styled.button`
  background-color: ${props => props.color || '#A57C4B'};
  color: white; border: none; padding: 15px;
  border-radius: 50px; width: 100%; font-weight: bold;
  cursor: pointer; margin-top: 15px;
`;

const QRCodeImg = styled.img`
  width: 200px;
  height: 200px;
  display: block;
  margin: 15px auto;
`;

// Estilo para a área da chave Pix clicável
const PixKeyContainer = styled.div`
  background: #f8f8f8;
  padding: 12px;
  border-radius: 12px;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
  margin: 10px 0;
  border: 1px dashed #A57C4B;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f0f0;
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export default function CartModal({ itens, onClose, onUpdateCart }) {
    const [etapa, setEtapa] = useState(1); // 1: Carrinho, 2: Checkout
    const [nome, setNome] = useState('');
    const [recado, setRecado] = useState('');

    const chavePix = "55999810295";
    const total = itens.reduce((acc, item) => acc + (item.price * item.quantidade), 0);

    const handleCopyPix = () => {
        navigator.clipboard.writeText(chavePix);
        alert("Chave Pix copiada! Agora é só colar no seu banco. 📋");
    };

    const handleWhatsApp = () => {
        if (!nome) return alert("Por favor, coloque seu nome.");

        const listaPresentes = itens.map(i => `${i.quantidade}x ${i.title}`).join(', ');
        const mensagem = `Olá Manu! Sou ${nome}. Estou enviando: ${listaPresentes}. Total: R$ ${total.toFixed(2)}. Mensagem: ${recado}`;

        window.location.href = `https://wa.me/${chavePix}?text=${encodeURIComponent(mensagem)}`;
    };

    if (etapa === 1) {
        return (
            <Overlay onClick={onClose}>
                <Modal onClick={e => e.stopPropagation()}>
                    <h2 style={{ textAlign: 'center' }}>Seu Carrinho 🎁</h2>
                    {itens.map(item => (
                        <ItemRow key={item.id}>
                            <div>
                                <strong>{item.title}</strong><br />
                                <small>R$ {item.price.toFixed(2)}</small><br />
                                <button onClick={() => onUpdateCart(itens.filter(i => i.id !== item.id))} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px', padding: 0 }}>Remover</button>
                            </div>
                            <QtyControls>
                                <button onClick={() => onUpdateCart(itens.map(i => i.id === item.id ? { ...i, quantidade: Math.max(1, i.quantidade - 1) } : i))}>-</button>
                                <span>{item.quantidade}</span>
                                <button onClick={() => onUpdateCart(itens.map(i => i.id === item.id ? { ...i, quantidade: i.quantidade + 1 } : i))}>+</button>
                            </QtyControls>
                        </ItemRow>
                    ))}
                    <h3 style={{ textAlign: 'center', margin: '20px 0' }}>Total: R$ {total.toFixed(2)}</h3>
                    <Button onClick={() => setEtapa(2)}>FINALIZAR PRESENTE</Button>
                    <Button color="#999" onClick={onClose}>VOLTAR</Button>
                </Modal>
            </Overlay>
        );
    }

    return (
        <Overlay onClick={onClose}>
            <Modal onClick={e => e.stopPropagation()}>
                <h2 style={{ textAlign: 'center' }}>Finalizar Presente 🎁</h2>
                <p style={{ textAlign: 'center' }}>Total: <strong>R$ {total.toFixed(2)}</strong></p>

                <p style={{ textAlign: 'center', fontSize: '14px', marginBottom: '5px' }}>1. Pague via Pix:</p>
                <QRCodeImg src="/pix-qrcode.jpeg" alt="QR Code Pix" />

                {/* Área da Chave Pix com função de copiar */}
                <PixKeyContainer onClick={handleCopyPix} title="Clique para copiar">
                    <span style={{ color: '#666', fontSize: '12px' }}>Chave Pix (Celular):</span><br />
                    <strong style={{ fontSize: '16px' }}>{chavePix}</strong><br />
                    <small style={{ color: '#A57C4B', fontWeight: 'bold' }}>(Clique para copiar)</small>
                </PixKeyContainer>

                <Input placeholder="Seu nome" value={nome} onChange={e => setNome(e.target.value)} />
                <TextArea placeholder="Recado final..." value={recado} onChange={e => setRecado(e.target.value)} />

                <Button color="#25d366" onClick={handleWhatsApp}>
                    JÁ FIZ O PIX, AVISAR MANU
                </Button>

                <button onClick={() => setEtapa(1)} style={{ background: 'none', border: 'none', width: '100%', marginTop: '10px', cursor: 'pointer', color: '#666' }}>
                    Voltar para o carrinho
                </button>
            </Modal>
        </Overlay>
    );
}