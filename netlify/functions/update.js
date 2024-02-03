const { handleMessage } = require('../../controller/lib/Telegram');

exports.handler = async e => {
    try {
        const messageObj = JSON.parse(e.body).message;
        console.log(messageObj);
        console.log(messageObj.text);
        console.log(messageObj.chat.id)
        await handleMessage(messageObj);
        return { statusCode: 200, body: "" }
    } catch (e) {
        console.error("error in handler:", e)
        return { statusCode: 400, body: e }
    }

}

// const handleMessage = require("../../controller/lib/Telegram");

// exports.handler = async (event) => {
//   const { message } = JSON.parse(event.body);
//   await handleMessage(message.chat.id, "I got your message!");
//   return { statusCode: 200 };
// };