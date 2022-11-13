const qrcode = require('qrcode-terminal');

const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({
    authStrategy: new LocalAuth()
});

client.initialize();

const banlist = [];

if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
        path: __dirname + "/config/.env",
    });
}

var symbol = process.env.SYMBOL;

client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (message) => {
    console.log(message.body);

    if (message.body === symbol + 'ping') {
        message.reply('pong');
    }
    if (message.body === '!wakeall') {
        const authorId = message.author || message.from;
        const chat = await message.getChat();
        const isSenderAdmin = false;
        if (chat.isGroup) {
          for(let participant of chat.participants) {
              if(participant.id._serialized === authorId && participant.isAdmin) {
                isSenderAdmin = true;
              }
          }
        }
        if (chat.isGroup && isSenderAdmin) {
            let text = "Shh!! Its an announcement!!";
            let mentions = [];

            for (let participant of chat.participants) {
                const contact = await client.getContactById(participant.id._serialized);

                mentions.push(contact);
                // text += `@${participant.id.user} `;
            }
            await chat.sendMessage(text, { mentions });
        }
    }

    if (message.body === symbol + "ban" && message.fromMe) {
        const chat = await message.getChat();

        banlist.push((await (await message.getQuotedMessage()).getContact()).id);

        await chat.sendMessage("User got banned!");
    }
});

