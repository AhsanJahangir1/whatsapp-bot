const venom = require('venom-bot');
const axios = require('axios');

// WhatsApp session start
venom
  .create({
    session: 'bot-session',
    multidevice: true,
  })
  .then((client) => start(client))
  .catch((err) => console.log(err));

function start(client) {
  client.onMessage(async (message) => {
    if (!message.isGroupMsg) {
      console.log('📩 Client:', message.body);

      try {
        const response = await axios.post(
          'https://n8n-production-67d3.up.railway.app/webhook-test/3a74b79a-bf2c-4d91-bb93-5aa358bef50d',
          { text: message.body }
        );

        await client.sendText(message.from, response.data.reply || '⚠️ AI reply nahi mila');
      } catch (error) {
        console.error('❌ Error:', error.message);
        await client.sendText(message.from, 'Server issue, try later.');
      }
    }
  });
}

