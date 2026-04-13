import React, { useState } from 'react';
import styled from 'styled-components';

// Verifique se esses componentes estão importados ou definidos no seu arquivo
// import { Overlay, ModalContent, Input, TextArea, SubmitButton } from './SeusEstilos';

export default function CartModal({ itens, onClose }) {
    const [nome, setNome] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [loading, setLoading] = useState(false);

    // Soma o total de todos os itens no carrinho
    const totalGeral = itens.reduce((acc, item) => acc + (item.price * item.quantidade), 0);

    const finalizarPresente = async () => {
        if (!nome.trim()) {
            alert("Por favor, coloque seu nome para a Manu saber quem deu o presente!");
            return;
        }

        setLoading(true);
        const dados = {
            convidado: nome,
            mensagem: mensagem,
            itens: itens.map(i => `${i.quantidade}x ${i.title}`).join(', '),
            total: totalGeral.toFixed(2)
        };

        try {
            const response = await fetch('/api/avisar-manu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Importante para a API ler o body corretamente
                },
                body: JSON.stringify(dados)
            });

            if (response.ok) {
                alert("Obrigado! A Manu já foi avisada do seu presente via WhatsApp.");
                onClose();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || "Erro ao avisar a Manu");
            }
        } catch (err) {
            console.error("Erro no checkout:", err);
            alert("Erro: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Overlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <h3 style={{ marginBottom: '10px' }}>Finalizar Presente 🎁</h3>

                {/* Resumo rápido dos itens para o convidado conferir */}
                <div style={{ fontSize: '0.9rem', marginBottom: '15px', textAlign: 'left', borderBottom: '1px solid #eee', pb: '10px' }}>
                    <strong>Total: R$ {totalGeral.toFixed(2)}</strong>
                </div>

                <div style={{ textAlign: 'center', margin: '15px 0' }}>
                    <p style={{ fontSize: '0.9rem', marginBottom: '5px' }}><strong>1. Escaneie o QR Code:</strong></p>
                    {/* Removido o /public/ pois o Next/Vercel serve a pasta public na raiz / */}
                    <img src="/pix-qrcode.jpeg" alt="QR Code Pix" style={{ width: '180px', borderRadius: '8px' }} />

                    <p style={{ marginTop: '15px', fontSize: '0.9rem', marginBottom: '5px' }}><strong>2. Ou copie a Chave Pix:</strong></p>
                    <div
                        style={{ background: '#f0f0f0', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}
                        onClick={() => {
                            navigator.clipboard.writeText('55999810295');
                            alert("Chave Pix copiada!");
                        }}
                        title="Clique para copiar"
                    >
                        <code style={{ fontSize: '1.1rem', color: '#333' }}>55999810295</code>
                        <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '5px' }}>(Clique para copiar)</div>
                    </div>
                </div>

                <Input
                    placeholder="Seu nome"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    style={{ marginBottom: '10px' }}
                />
                <TextArea
                    placeholder="Mensagem carinhosa para a Manu..."
                    value={mensagem}
                    onChange={e => setMensagem(e.target.value)}
                    style={{ marginBottom: '15px', height: '80px' }}
                />

                <SubmitButton onClick={finalizarPresente} disabled={loading}>
                    {loading ? "Enviando aviso..." : "ENVIAR MENSAGEM E FINALIZAR"}
                </SubmitButton>

                <button
                    onClick={onClose}
                    style={{ background: 'none', border: 'none', color: '#888', marginTop: '10px', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                    Voltar e escolher mais
                </button>
            </ModalContent>
        </Overlay>
    );
}