import React, { useState } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';
import { loadStripe } from '@stripe/stripe-js';


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 20px;
  width: 90%;
  max-width: 400px;
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  height: 100px;
`;

const SubmitButton = styled.button`
  width: 100%;
  background: var(--accent);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;

  &:hover { background: var(--accent-dark); }

  &:disabled { background: #A57C4B; }
`;

export default function GiftModal({ gift, onClose }) {
    const [nome, setNome] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Salvar no Supabase
        const { error: supabaseError } = await supabase
            .from('presentes_recebidos')
            .insert([
                {
                    nome_convidado: nome,
                    presente_id: gift.id,
                    valor: gift.price,
                    mensagem: mensagem
                }
            ]);

        if (supabaseError) {
            alert("Erro ao salvar recado: " + supabaseError.message);
            setLoading(false);
            return;
        }

        // Lógica do Stripe
        try {
            const response = await fetch('/api/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: gift.title,
                    price: gift.price,
                    guestName: nome,
                }),
            });

            const session = await response.json();

            if (!session.id) {
                throw new Error("Não foi possível gerar a sessão de pagamento.");
            }

            const stripe = await stripePromise;
            const { error: stripeError } = await stripe.redirectToCheckout({
                sessionId: session.id,
            });

            if (stripeError) {
                alert(stripeError.message);
            }
        } catch (err) {
            alert("Erro no pagamento: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Overlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <h3 style={{ fontFamily: 'Montserrat' }}>Presentear com {gift.title}</h3>
                <p style={{ fontSize: '14px', color: '#666' }}>Deixe um recado para a Manu:</p>

                <form onSubmit={handleSubmit}>
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
                    <SubmitButton type="submit" disabled={loading}>
                        {loading ? "Redirecionando..." : "Confirmar e Ir para Pagamento"}
                    </SubmitButton>
                    <button type="button" onClick={onClose} style={{ width: '100%', background: 'none', border: 'none', marginTop: '10px', cursor: 'pointer', color: '#999' }}>Cancelar</button>
                </form>
            </ModalContent>
        </Overlay>
    );
}