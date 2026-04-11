const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import { createClient } from '@supabase/supabase-js';

// Usando os nomes exatos das suas variáveis na Vercel
const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { title, price, guestName, message, giftId } = req.body;

            // 1. Salva na tabela presentes_recebidos usando a service_role
            const { error: dbError } = await supabase
                .from('presentes_recebidos')
                .insert([
                    {
                        nome_convidado: guestName,
                        mensagem: message,
                        presente_id: giftId,
                        valor: price,
                        status_pagamento: 'pendente'
                    }
                ]);

            if (dbError) {
                console.error("Erro Supabase:", dbError);
                throw new Error("Erro ao salvar mensagem no banco.");
            }

            // 2. Cria a sessão do Stripe
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card', 'pix'],
                line_items: [
                    {
                        price_data: {
                            currency: 'brl',
                            product_data: {
                                name: `Presente: ${title}`,
                                description: `De: ${guestName}`,
                            },
                            unit_amount: Math.round(price * 100),
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${req.headers.origin}/sucesso`,
                cancel_url: `${req.headers.origin}/cancelado`,
            });

            res.status(200).json({ id: session.id });
        } catch (err) {
            console.error("Erro Geral no Handler:", err.message);
            res.status(500).json({ error: err.message });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}