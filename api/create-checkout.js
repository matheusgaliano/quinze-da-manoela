const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

// Inicialização com .trim() para evitar espaços invisíveis que quebram a conexão
const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL.trim(),
    process.env.SUPABASE_SERVICE_ROLE_KEY.trim()
);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    try {
        const { title, price, guestName, message, giftId } = req.body;

        // Validação de segurança: Se o preço for 0 ou inválido, o Stripe rejeita.
        const unitAmount = Math.round(parseFloat(price) * 100);
        if (!unitAmount || unitAmount <= 0) {
            throw new Error("Valor do presente inválido para o pagamento.");
        }

        // 1. Salva no banco (Já sabemos que está funcionando!)
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
            // Seguimos mesmo com erro no banco para não perder a venda, 
            // mas aqui o ideal é que o banco já esteja ok como vimos no print.
        }

        // 2. Cria a sessão do Stripe
        // Adicionamos metadados para você saber quem pagou lá no painel do Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'pix'],
            line_items: [
                {
                    price_data: {
                        currency: 'brl',
                        product_data: {
                            name: `Presente: ${title}`,
                            description: `Recado de: ${guestName}`,
                        },
                        unit_amount: unitAmount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.origin}/sucesso`,
            cancel_url: `${req.headers.origin}/cancelado`,
            metadata: {
                guestName: guestName,
                giftId: giftId
            }
        });

        // Retorno do ID da sessão para o frontend fazer o redirecionamento
        return res.status(200).json({ id: session.id });

    } catch (err) {
        console.error("ERRO NO CHECKOUT:", err.message);
        // Enviamos a mensagem real do erro para o seu alert do frontend
        return res.status(500).json({ error: err.message });
    }
}