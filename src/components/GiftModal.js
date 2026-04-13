import React, { useState } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white; padding: 30px; border-radius: 20px;
  width: 90%; max-width: 400px; position: relative;
`;

const Input = styled.input`
  width: 100%; padding: 12px; margin: 10px 0;
  border: 1px solid #ddd; border-radius: 8px;
`;

const TextArea = styled.textarea`
  width: 100%; padding: 12px; margin: 10px 0;
  border: 1px solid #ddd; border-radius: 8px; height: 100px;
`;

const SubmitButton = styled.button`
  width: 100%; background: #A57C4B; color: white;
  border: none; padding: 15px; border-radius: 30px;
  cursor: pointer; font-weight: bold; margin-top: 10px;
`;

export default function GiftModal({ gift, onClose, onAddToCart }) {
    const [nome, setNome] = useState('');
    const [mensagem, setMensagem] = useState('');

    const handleConfirmar = (e) => {
        e.preventDefault();
        // Apenas adicionamos ao carrinho e passamos os recados
        onAddToCart({
            ...gift,
            guestName: nome,
            guestMessage: mensagem,
            quantidade: 1
        });
        onClose();
    };

    return (
        <Overlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <h3>Presentear com {gift.title}</h3>
                <form onSubmit={handleConfirmar}>
                    <Input
                        placeholder="Seu nome"
                        required
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                    />
                    <TextArea
                        placeholder="Sua mensagem carinhosa..."
                        value={mensagem}
                        onChange={e => setMensagem(e.target.value)}
                    />
                    <SubmitButton type="submit">
                        Adicionar ao Carrinho
                    </SubmitButton>
                    <button type="button" onClick={onClose} style={{ width: '100%', background: 'none', border: 'none', marginTop: '10px', color: '#999', cursor: 'pointer' }}>
                        Cancelar
                    </button>
                </form>
            </ModalContent>
        </Overlay>
    );
}