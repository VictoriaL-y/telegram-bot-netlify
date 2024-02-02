const axios = require("axios").default;

await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
    chat_id: JSON.parse(e.body).message.chat.id,
    text: "I got your message!",
});

return { statusCode: 200 };
