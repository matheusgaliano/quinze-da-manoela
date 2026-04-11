const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

// Inicialização fora do handler para performance
const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    try {
        const { title, price, guestName, message, giftId } = req.body;

        // 1. Salva na tabela presentes_recebidos usando a service_role
        // IMPORTANTE: Garantimos que presente_id seja um número para bater com o banco (int4)
        const { error: dbError } = await supabase
            .from('presentes_recebidos')
            .insert([
                {
                    nome_convidado: guestName,
                    mensagem: message,
                    presente_id: parseInt(giftId),
                    valor: parseFloat(price),
                    status_pagamento: 'pendente'
                }
            ]);

        if (dbError) {
            console.error("Erro Supabase:", dbError.message);
            return res.status(500).json({ error: "Erro ao salvar no banco." });
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

        // Retorno de sucesso
        return res.status(200).json({ id: session.id });

    } catch (err) {
        console.error("Erro Geral no Handler:", err.message);
        return res.status(500).json({ error: err.message });
    }
}