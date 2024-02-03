const { handleMessage } = require('../../controller/lib/Telegram');

exports.handler = async e => {
    try {
        const messageObj = JSON.parse(e.body).message;
        console.log(messageObj);
        await handleMessage(messageObj);
        return { statusCode: 200, body: "" }
    } catch (e) {
        console.error("error in handler:", e)
        return { statusCode: 400, body: e }
    }
}