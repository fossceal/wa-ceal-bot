const client = require("../config/client");

exports.announce = async (message, messageBody) => {
    const authorId = message.author || message.from;
    const chat = await message.getChat();
    let mentions = [];

    let isSenderAdmin = false;
    if (chat.isGroup) {
        for (let participant of chat.participants) {
            if (participant.id._serialized === authorId && participant.isAdmin) {
                isSenderAdmin = true;
            }
            // const contact = (await client.getContactById(participant.id._serialized)).id._serialized;
            mentions.push(participant.id._serialized);
        }
    }

    if (isSenderAdmin) {
        let text = (messageBody === "") ? `*${chat.name} got tagged!!*` : `*${messageBody}*`;
        await chat.sendMessage(text, { mentions });
    } else {
        await chat.sendMessage("You are not an admin!");
    }
}