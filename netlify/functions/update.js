const { handleMessage } = require('../../controller/lib/Telegram');

exports.handler = async (req, method) => {
    const { body } = req;
    if (body) {
        const messageObj = body.message;
        await handleMessage(messageObj);
    }
    return await req;

}