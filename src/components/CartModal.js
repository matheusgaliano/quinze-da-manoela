import React, { useState } from 'react';
import styled from 'styled-components';

// ... (seus estilos Overlay, ModalContent, SubmitButton, etc)

export default function CartModal({ itens, onClose }) {
    const [nome, setNome] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [loading, setLoading] = useState(false);

    const totalGeral = itens.reduce((acc, item) => acc + (item.price * item.quantidade), 0);

    const finalizarPresente = async () => {
        setLoading(true);
        const dados = {
            convidado: nome,
            mensagem: mensagem,
            itens: itens.map(i => `${i.quantidade}x ${i.title}`).join(', '),
            total: totalGeral.toFixed(2)
        };

        try {
            // AQUI É ONDE A TELA "CHAMA" O ARQUIVO DA API
            const response = await fetch('/api/avisar-manu', {
                method: 'POST',
                body: JSON.stringify(dados)
            });

            if (response.ok) {
                alert("Obrigado! A Manu já foi avisada do seu presente.");
                onClose();
            } else {
                throw new Error("Erro ao avisar a Manu");
            }
        } catch (err) {
            alert("Erro: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Overlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <h3>Finalizar Presente 🎁</h3>

                {/* QR CODE E CHAVE PIX UM ABAIXO DO OUTRO */}
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    <p><strong>1. Escaneie o QR Code:</strong></p>
                    <img src="/public/pix-qrcode.jpeg" alt="QR Code Pix" style={{ width: '180px' }} />

                    <p style={{ marginTop: '15px' }}><strong>2. Ou copie a Chave Pix:</strong></p>
                    <div style={{ background: '#f0f0f0', padding: '10px', borderRadius: '8px' }}>
                        <code>55999810295</code>
                    </div>
                </div>

                <Input placeholder="Seu nome" value={nome} onChange={e => setNome(e.target.value)} />
                <TextArea placeholder="Mensagem para a Manu..." value={mensagem} onChange={e => setMensagem(e.target.value)} />

                <SubmitButton onClick={finalizarPresente} disabled={loading}>
                    {loading ? "Enviando..." : "ENVIAR MENSAGEM E FINALIZAR"}
                </SubmitButton>
            </ModalContent>
        </Overlay>
    );
}