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

        // Validação de segurança: Math.abs garante número positivo e Math.round evita decimais que o Stripe rejeita
        const unitAmount = Math.abs(Math.round(parseFloat(price) * 100));

        if (!unitAmount || unitAmount <= 0) {
            throw new Error("O valor do presente precisa ser maior que zero.");
        }

        // 1. Salva no banco (Já sabemos que está funcionando pelo seu log!)
        const { error: dbError } = await supabase
            .from('presentes_recebidos')
            .insert([
                {
                    nome_convidado: guestName || 'Convidado',
                    mensagem: message || '',
                    presente_id: parseInt(giftId),
                    valor: parseFloat(price),
                    status_pagamento: 'pendente'
                }
            ]);

        if (dbError) {
            console.error("Erro Supabase:", dbError.message);
        }

        // 2. Cria a sessão do Stripe com tratativas para campos vazios
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'pix'],
            line_items: [
                {
                    price_data: {
                        currency: 'brl',
                        product_data: {
                            // O Stripe pode dar erro 500 se o nome for uma string vazia
                            name: `Presente: ${title || 'Contribuição'}`,
                            description: `De: ${guestName || 'Amigo(a)'}`,
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
                guestName: guestName || 'Anônimo',
                giftId: giftId ? giftId.toString() : '0'
            }
        });

        // Retorno do ID da sessão para o frontend
        return res.status(200).json({ id: session.id });

    } catch (err) {
        console.error("ERRO NO CHECKOUT:", err.message);
        // Retornamos a mensagem exata para que o seu alert no frontend mostre o que o Stripe barrou
        return res.status(500).json({ error: err.message });
    }
}