const twilio = require('twilio');

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        // Verifica se o corpo já é um objeto ou precisa de parse
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { convidado, mensagem, itens, total } = body;

        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

        await client.messages.create({
            from: process.env.TWILIO_WHATSAPP_NUMBER,
            to: process.env.MANU_WHATSAPP_NUMBER,
            body: `🎉 *Novo Presente para Manoela!*\n\n👤 *Convidado:* ${convidado}\n🎁 *Itens:* ${itens}\n💰 *Valor Total:* R$ ${total}\n\n" ${mensagem || 'Sem mensagem'} "`
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Erro Twilio:', error);
        return res.status(500).json({ error: 'Falha ao enviar WhatsApp', details: error.message });
    }
}