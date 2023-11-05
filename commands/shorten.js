const client = require("../config/client");
const axios = require("axios");

exports.shorten = async (message, messageBody) => {
    const chat = await message.getChat();

    let link = messageBody.split(" ")[0];
    let alias = messageBody.split(" ")[1];

    if (alias === undefined) {
        await chat.message(`*Please provide an alias!*`);
        return;
    }

    if (link === undefined) {
        await chat.message(`*Please provide a link!*`);
        return;
    }

    const config = {
        headers: {
            "Authorization": "Bearer " + process.env.TINYURL_API_KEY,
            "Content-Type": "application/json"
        }
    }

    const data = {
        "url": link,
        "domain": "tinyurl.com",
        "description": "string",
        "alias": alias
    }

    try {
        const response = await axios.post("https://api.tinyurl.com/create", data, config);
        var jsonData = response.data.data;
        await chat.sendMessage(`Here is the shorten Link info: *${jsonData["tiny_url"]}*`);
    } catch (e) {
        await chat.sendMessage(`*${e.response.data.errors[0]}*`);
    }

    return;
}