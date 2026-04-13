const twilio = require('twilio');

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { convidado, mensagem, itens, total } = JSON.parse(req.body);

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    try {
        await client.messages.create({
            from: process.env.TWILIO_WHATSAPP_NUMBER,
            to: process.env.MANU_WHATSAPP_NUMBER,
            body: `🎉 *Novo Presente para Manoela!*\n\n👤 *Convidado:* ${convidado}\n🎁 *Itens:* ${itens}\n💰 *Valor Total:* R$ ${total}\n\n" ${mensagem} "`
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Erro Twilio:', error);
        return res.status(500).json({ error: 'Falha ao enviar WhatsApp' });
    }
}