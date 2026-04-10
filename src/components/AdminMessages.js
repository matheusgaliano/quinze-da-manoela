import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';

const AdminContainer = styled.div`
  padding: 40px 20px;
  max-width: 900px;
  margin: 0 auto;
`;

const MessageCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  border-left: 6px solid var(--primary);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default function AdminMessages({ onBack }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('presentes_recebidos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) console.error("Erro:", error);
            else setMessages(data);
            setLoading(false);
        };
        fetchMessages();
    }, []);

    if (loading) return <AdminContainer>Carregando mensagens da Manu...</AdminContainer>;

    return (
        <AdminContainer>
            <button onClick={onBack} style={{ marginBottom: '20px', cursor: 'pointer' }}>← Voltar para o Site</button>
            <h2 style={{ color: 'var(--secondary-dark)', fontSize: '2.5rem', marginBottom: '30px' }}>
                Mensagens da Manu 👑
            </h2>
            {messages.length === 0 ? (
                <p>Ainda não recebemos mensagens.</p>
            ) : (
                messages.map((m) => (
                    <MessageCard key={m.id}>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: '0 0 10px 0', color: 'var(--primary-dark)' }}>{m.nome_convidado}</h3>
                            <p style={{ fontStyle: 'italic', color: '#555' }}>"{m.mensagem}"</p>
                            <small style={{ color: '#999' }}>{new Date(m.created_at).toLocaleDateString('pt-BR')}</small>
                        </div>
                        <div style={{ textAlign: 'right', minWidth: '100px' }}>
                            <span style={{ background: '#e0f2f1', padding: '5px 10px', borderRadius: '20px', fontSize: '0.8rem', color: '#00796b', fontWeight: 'bold' }}>
                                R$ {m.valor}
                            </span>
                        </div>
                    </MessageCard>
                ))
            )}
        </AdminContainer>
    );
}