const TelegramApi = require("node-telegram-bot-api");
const https = require("https");
const { generateRequestUrl, normaliseResponse } = require('google-translate-api-browser');
require('dotenv').config()


const api = process.env.TOKEN;
const bot = new TelegramApi(api, { polling: true })


bot.setMyCommands([
    { command: "/start", description: "Boshlash" },
    { command: "/info", description: "Ma'lumotlar" },
    { command: "/languages", description: "Tillar" }
])

const options = {
    reply_markup: {
        inline_keyboard: [
            [{ text: 'Uzbekcha', callback_data: 'uz' }],
            [{ text: 'English', callback_data: 'en' }],
            [{ text: 'عربي', callback_data: 'ar' }],
            [{ text: 'Français', callback_data: 'fr' }],
            [{ text: 'Русский', callback_data: 'ru' }]
        ]
    }
};

let lan = "en";

bot.on("callback_query", async (msg) => {
    try {
        const chatId = msg.message.chat.id;
        await bot.sendMessage(chatId, "Ajoyib!!!");
        await bot.sendMessage(chatId, "Birorta so'z kiriting!!!");
        lan = msg.data
    } catch (error) {
        console.log(error);
    }
});

bot.on("message", async msg => {
    try {
        const text = msg.text
        const chatId = msg.chat.id

        if (text == "/start") {
            const user = msg.from.first_name
            const lastname = msg.from.last_name
            await bot.sendMessage(chatId, `Assalomu alaykum ${user} ${lastname} botga xush kelibsiz!!! Bu bot sizga gap va so'zlarni tarjima qilib bera oladi.`)
            await bot.sendMessage(chatId, 'Sizga qaysi tilni tarjimasi kerak?', options);
        }

        else if (text == "/info") {
            await bot.sendMessage(chatId, "Bu bot sizga siz kiritgan so'zlaringizni tarjima qilib beradi!")
        }

        else if (text == "/languages") {
            await bot.sendMessage(chatId, 'Sizga qaysi tilni tarjimasi kerak?', options);
        }

        else {
            const url = generateRequestUrl(text, { to: lan });

            https.get(url, (resp) => {
                resp.on('data', (chunk) => {
                    try {
                        bot.sendMessage(chatId, normaliseResponse(JSON.parse(chunk)).text);
                    } catch (error) {
                        console.log(error.message);
                    }
                });
            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });
        }
    } catch (error) {
        console.log((error.message));
    }
})
