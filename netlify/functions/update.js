const axios = require("axios").default;

exports.handler = async (event) => {

    await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
        chat_id: JSON.parse(event.body).message.chat.id,
        text: "I got your message!",
    });

    return { statusCode: 200 };

};


