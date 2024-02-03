const { handleMessage } = require('../../controller/lib/Telegram');

exports.handler = async (req, method) => {
    const { body } = req;
    if (body) {
        const messageObj = body.message;
        console.log(messageObj);
        console.log(messageObj.text);
        console.log(messageObj.chat_id)
        await handleMessage(messageObj);
    }

    return { statusCode: 200 };

}

// const handleMessage = require("../../controller/lib/Telegram");

// exports.handler = async (event) => {
//   const { message } = JSON.parse(event.body);
//   await handleMessage(message.chat.id, "I got your message!");
//   return { statusCode: 200 };
// };