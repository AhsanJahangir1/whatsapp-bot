const venom = require('venom-bot');
const axios = require('axios');

// WhatsApp session start
venom
  .create({
    session: 'bot-session', // session name
    multidevice: true       // multi-device support
  })
  .then((client) => start(client))
  .catch((err) => console.log(err));

function start(client) {
  client.onMessage(async (message) => {
    if (!message.isGroupMsg) {
      console.log('📩 Client:', message.body);

      try {
        // Send user message to your n8n webhook
        const response = await axios.post(
          'https://n8n-production-67d3.up.railway.app/webhook-test/3a74b79a-bf2c-4d91-bb93-5aa358bef50d',
          { text: message.body }
        );

        // Send AI reply back to WhatsApp
        await client.sendText(message.from, response.data.reply || 'AI se reply nahi aya');
      } catch (error) {
        console.error('❌ Error:', error.message);
        await client.sendText(message.from, 'Server issue, try again later.');
      }
    }
  });
}
