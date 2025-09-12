const makeWASocket = require('@adiwajshing/baileys').default;
const { useMultiFileAuthState } = require('@adiwajshing/baileys');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const sender = msg.key.remoteJid;
        const text = msg.message.conversation;

        console.log("Received:", text);

        // Simple auto reply
        await sock.sendMessage(sender, { text: "🤖 Auto Reply: " + text });
    });
}

startBot();

app.get("/", (req, res) => {
    res.send("WhatsApp bot is running!");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


