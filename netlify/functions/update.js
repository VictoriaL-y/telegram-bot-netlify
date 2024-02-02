const { handleMessage } = require('../../controller/lib/Telegram');

exports.handler = async (req) => {
    const { body } = req;
    if (body) {
        const messageObj = body.message;
        await handleMessage(messageObj);
    }
    return;

}