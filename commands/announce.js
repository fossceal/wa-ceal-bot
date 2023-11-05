const client = require("../config/client");

exports.announce = async (message, messageBody) => {
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
        let text = (messageBody === "") ? `*${chat.name} got tagged!!*` : `*${messageBody}*`;
        let mentions = [];

        for (let participant of chat.participants) {
            const contact = (await client.getContactById(participant.id._serialized)).id._serialized;
            mentions.push(contact);
        }
        await chat.sendMessage(text, { mentions });
    }
}