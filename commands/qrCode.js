// const { MessageMedia } = require("whatsapp-web.js");
// const client = require("../config/client");
// const axios = require("axios");

// exports.qrCode = async (message, messageBody) => {
//     const chat = await message.getChat();
//     const url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${messageBody}`

//     try {
//         const response = axios
//             .get(url, {
//                 responseType: 'arraybuffer'
//             })
//             .then((response) => {
//                 Buffer.from(response.data, 'binary').toString('base64')
//                 console.log(response.data);
//                 const media = new MessageMedia('image/png', response.data);
//                 chat.sendMessage(media);
//             })
//     } catch (err) {
//         console.log(err);
//     }
//     return;
// }