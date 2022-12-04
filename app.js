const {announce} = require('./commands/announce');
const client = require('./config/client');

//TODO: convert to db
const banlist = []; 

if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
        path: __dirname + "/.env",
    });
}

var symbol = process.env.SYMBOL;

// listens to the messages of owner as well as others
client.on("message_create", async (message) => {

    const splitedMessage = message.body.split(" ");
    const command = splitedMessage[0];
    const messageBodyArray = [];

    for (var i = 1; i < splitedMessage.length; i++) {
        messageBodyArray.push(splitedMessage[i]);
    }

    const messageBody = messageBodyArray.join(" ");

    //ban
    if (command === symbol + "ban" && message.fromMe) {
        const chat = await message.getChat();
        let id = "";
        try {
            id = (await message.getQuotedMessage()).author;
            banlist.push(id);
            await chat.sendMessage(`*User got banned!*`);
        } catch (e) {
            console.log(e);
        }
    }

    //unban
    if (command === symbol + "unban" && message.fromMe) {
        const chat = await message.getChat();

        try {
            const id = (await message.getQuotedMessage()).author;
            const index = banlist.indexOf(id);
            if (index > -1) {
                banlist.splice(index, 1);
            }
    
            await chat.sendMessage(`*User has been unbanned!*`);
        } catch (e) {
            console.log(e);
        }
    }

    const id = message.author;
    const isbanned = banlist.includes(id);
    
    //announce
    if (command === symbol + "announce" && !isbanned) {
       announce(message,messageBody);
    }

});


//listens to others messages only
client.on("message", async (message) => {
    const id = message.author;
    const isbanned = banlist.includes(id);

    //ping
    if (message.body === symbol + "ping" && !isbanned) {
        message.reply("pong");
    }
});
