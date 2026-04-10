const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// Precisamos importar o supabase para salvar a mensagem
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // Use a Service Role para permissão de escrita na API
);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Pegando a mensagem que o convidado escreveu
            const { title, price, guestName, message, giftId } = req.body;

            // 1. Salva no banco de dados primeiro
            const { error: dbError } = await supabase
                .from('presentes_recebidos')
                .insert([
                    {
                        nome_convidado: guestName,
                        mensagem: message,
                        presente_id: giftId,
                        valor: price,
                        status_pagamento: 'pendente' // Começa como pendente
                    }
                ]);

            if (dbError) throw new Error("Erro ao salvar no banco: " + dbError.message);

            // 2. Cria a sessão no Stripe
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
                            unit_amount: Math.round(price * 100), // Usando Math.round para evitar erros de centavos
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
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}