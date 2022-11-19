const qrcode = require("qrcode-terminal");

const { Client, LocalAuth } = require("whatsapp-web.js");
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ["--no-sandbox"],
    },
});

client.initialize();

const banlist = [];

if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
        path: __dirname + "/config/.env",
    });
}

var symbol = process.env.SYMBOL;

client.on("loading_screen", (percent, message) => {
    console.log("LOADING SCREEN", percent, message);
});

client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => {
    console.log("AUTHENTICATED");
});

client.on("auth_failure", (msg) => {
    // Fired if session restore was unsuccessful
    console.error("AUTHENTICATION FAILURE", msg);
});

client.on("ready", () => {
    console.log("Client is ready!");
});

client.on("message_create", async (message) => {
    if (message.body === symbol + "ban" && message.fromMe) {
        const chat = await message.getChat();
        let id = "";
        try {
            id = (await message.getQuotedMessage()).author;
            banlist.push(id);
            await chat.sendMessage("User got banned!");
        } catch (e) {
            console.log(e);
        }
    }

    if (message.body === symbol + "unban" && message.fromMe) {
        const chat = await message.getChat();

        try {
            const id = (await message.getQuotedMessage()).author;
            const index = banlist.indexOf(id);
            if (index > -1) {
                banlist.splice(index, 1);
            }
    
            await chat.sendMessage("User has been unbanned!");
        } catch (e) {
            console.log(e);
        }
    }

    const id = message.author;
    const isbanned = banlist.includes(id);
    if (message.body === symbol + "announce" && !isbanned) {
        const authorId = message.author || message.from;
        const chat = await message.getChat();
        let isSenderAdmin = false;
        if (chat.isGroup) {
            for (let participant of chat.participants) {
                if (participant.id._serialized === authorId && participant.isAdmin) {
                    isSenderAdmin = true;
                }
            }
        }
        if (chat.isGroup && isSenderAdmin) {
            let text = "❗❗";
            let mentions = [];

            for (let participant of chat.participants) {
                const contact = await client.getContactById(participant.id._serialized);

                mentions.push(contact);
                // text += `@${participant.id.user} `;
            }
            await chat.sendMessage(text, { mentions });
        }
    }
});

client.on("message", async (message) => {
    const id = message.author;
    const isbanned = banlist.includes(id);

    if (message.body === symbol + "ping" && !isbanned) {
        message.reply("pong");
    }
});
