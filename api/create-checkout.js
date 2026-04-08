const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { title, price, guestName } = req.body;

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card', 'pix'], // Aceita Pix e Cartão
                line_items: [
                    {
                        price_data: {
                            currency: 'brl',
                            product_data: {
                                name: `Presente: ${title}`,
                                description: `De: ${guestName}`,
                            },
                            unit_amount: price * 100,
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
            res.status(500).json({ error: err.message });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}