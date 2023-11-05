const client = require("../config/client");

exports.info = async (message) => {
    const chat = await message.getChat();
    const body = `*Available Commands:* \n\n => *!announce* - Tag all members in a group | !announce text\n\n=> *!shorten* - Shorten a link | !shorten link alias\n\n=> *!chat* - Chat with the bot (Chat GPT-3.5) | !chat text\n\n=> *!info* - Show this message \n`
    await chat.sendMessage(body);
}