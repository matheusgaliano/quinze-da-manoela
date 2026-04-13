import React, { useState } from 'react';
import styled from 'styled-components';

export default function CartModal({ itens, onClose }) {
    const [nome, setNome] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [loading, setLoading] = useState(false);

    const totalGeral = itens.reduce((acc, item) => acc + (item.price * item.quantidade), 0);

    const finalizarPresente = async () => {
        if (!nome.trim()) {
            alert("Por favor, preencha seu nome.");
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            if (response.ok) {
                alert("Sucesso! A Manu foi avisada. Não esqueça de concluir o Pix!");
                onClose();
            } else {
                const errData = await response.json();
                throw new Error(errData.error || "Erro na API");
            }
        } catch (err) {
            alert("Erro ao avisar: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
            <div style={{ background: 'white', padding: '25px', borderRadius: '20px', width: '90%', maxWidth: '400px', textAlign: 'center' }}>
                <h3>Finalizar Presente 🎁</h3>
                <p>Total: <strong>R$ {totalGeral.toFixed(2)}</strong></p>

                <div style={{ margin: '20px 0' }}>
                    <p style={{ fontSize: '14px' }}>1. Pague via Pix:</p>
                    <img src="/pix-qrcode.jpeg" alt="Pix" style={{ width: '150px', margin: '10px 0' }} />
                    <div
                        onClick={() => { navigator.clipboard.writeText('55999810295'); alert('Copiado!'); }}
                        style={{ background: '#eee', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}
                    >
                        Chave: 55999810295 (Clique para copiar)
                    </div>
                </div>

                <input
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                    placeholder="Seu nome"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                />
                <textarea
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd', height: '60px' }}
                    placeholder="Recado final..."
                    value={mensagem}
                    onChange={e => setMensagem(e.target.value)}
                />

                <button
                    onClick={finalizarPresente}
                    disabled={loading}
                    style={{ width: '100%', padding: '15px', background: '#A57C4B', color: 'white', border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    {loading ? "Enviando..." : "JÁ FIZ O PIX, AVISAR MANU"}
                </button>
                <button onClick={onClose} style={{ marginTop: '10px', background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}>Voltar</button>
            </div>
        </div>
    );
}