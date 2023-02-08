const { read_file, write_file } = require("./fs/fs_api");
const bcrypt = require('bcryptjs');
const TelegramApi = require("node-telegram-bot-api");
require('dotenv').config()
let hashPsw, salt, admin1 = false
const api = process.env.TOKEN;
const ADMIN = process.env.ADMIN
const bot = new TelegramApi(api, { polling: true })

const remove_options = {
    reply_markup: {
        remove_keyboard: true
    }
}

bot.setMyCommands([
    { command: "/start", description: "Boshlash" },
    { command: "/info", description: "Ma'lumotlar" },
    { command: "/clear", description: "Botni tozalash" }
])

const options = {
    reply_markup: JSON.stringify({
        keyboard: [
            [{ text: "userlar ro'yhati" }, { text: "user qo'shish" }],
            [{ text: "userni o'chirish" }, { text: "ball kiritish" }]
        ]
    })
};

let start = read_file("start.json")[0];

bot.on("message", async msg => {
    let users = read_file("users.json")
    let text = msg.text
    const chatId = msg.chat.id
    text = text.split('')
    for (let i in text) {
        if (text[+i] == 'x') {
            text[+i] = 'h'
        }
    }
    text = text.join("")

    let admin = read_file("admin.json");
    let parol = text.split(" ")
    if (parol.length == 2 && parol[0] == "parol:" && parol[1] == ADMIN) {
        salt = await bcrypt.genSalt(10)
        hashPsw = await bcrypt.hash(`${chatId}`, salt)
        if (admin.length == 0) {
            write_file("admin.json", [hashPsw])
        }
        admin1 = true
    }


    text = text.toLowerCase()

    if (text == "/start") {
        const user = msg.from.first_name
        const lastname = msg.from.last_name
        bot.sendMessage(chatId, `Assalomu alaykum ${user} ${lastname} botga xush kelibsiz!!!\n/info bot haqida\n/ball ball haqida ma'lumot\n/clear botni tozalash`, remove_options)
    }

    if (await bcrypt.compare(`${chatId}`, `${admin[0]}`) || admin1) {
        try {
            if (start != text) {

                if (text == `parol: ${ADMIN}`.toLowerCase()) {
                    console.log('psw');
                    const user = msg.from.first_name
                    const lastname = msg.from.last_name
                    bot.sendMessage(chatId, `Assalomu alaykum ${user} ${lastname} admin panelga xush kelibsiz!!! `, options)

                    write_file("start.json", [text])
                }

                else if (text == "/info") {
                    bot.sendMessage(chatId, "Bu bot sizga sizni balingizni chiqarib beradi!", options)
                }

                else if (text == "/clear") {
                    console.log(msg.message_id);
                    for (let i = 0; i <= 50; i++) {
                        bot.deleteMessage(chatId, msg.message_id - i, remove_options)
                    }
                }

                else if (text == "/button") {
                    bot.sendMessage(chatId, "buttons", options)
                }

                else if (text == "userlar ro'yhati") {
                    let content = '';

                    users.forEach((user, index) => {
                        user[0] = index + 1;
                    });

                    users.forEach(user => {
                        content += user.join(",    ") + '\n';
                    })

                    write_file("users.json", users)
                    write_file("start.json", [text])
                    bot.sendMessage(chatId, content)
                }

                else if (text == "user qo'shish") {
                    bot.sendMessage(chatId, "add: Familiya Ism => add: Eshmatov Toshmat")
                }

                else if (text == "userni o'chirish") {
                    bot.sendMessage(chatId, "remove: Id => remove: 2")
                }

                else if (text == "ball kiritish") {
                    bot.sendMessage(chatId, "ball: Id ball => ball: 2 80")
                }

                else {
                    let message = text.split(" ")
                    if (message[0] == "add:" && message.length == 3) {
                        users.push([users.length + 1, message[1].charAt(0).toUpperCase() + message[1].slice(1), message[2].charAt(0).toUpperCase() + message[2].slice(1)]);
                        write_file("start.json", [text])
                        write_file("users.json", users)
                        bot.sendMessage(chatId, "User qo'shildi!", options);
                    }

                    else if (message[0] == "remove:" && message.length == 2) {
                        let bool = true;
                        users.map((user, index) => {
                            if (user[0] == message[1]) {
                                bool = false;
                                users.splice(+index, 1);
                            }
                        })

                        if (!bool) {
                            write_file("start.json", [text])
                            write_file("users.json", users)
                            bot.sendMessage(chatId, "User o'chirildi!", options);
                        } else {
                            bot.sendMessage(chatId, "Bunday user mavjud emas!", options);
                        }
                    }

                    else if (message[0] == "ball:" && message.length == 3) {
                        let bool = true;
                        users.find(user => {
                            console.log(user[0]);
                            if (user[0] == message[1]) {
                                console.log(user[0], message[1]);
                                bool = false;
                                bot.sendMessage(chatId, "Ball kiritildi!", options);
                                user[3] = message[2];
                            }
                        })
                        if (!bool) {
                            write_file("users.json", users)
                            write_file("start.json", [text])
                        } else {
                            bot.sendMessage(chatId, "Bunday user mavjud emas!", options);
                        }
                    }

                    else {
                        if (text != "/start") {
                            bot.sendMessage(chatId, "Bunday so'rov mavjud emas!", options)
                        }
                    }
                }
            }
        } catch (error) {
            console.log((error.message));
        }
    } else {
        try {
            if (text == "/ball") {
                bot.sendMessage(chatId, "Id ism va familiyangizni quyidagicha kiriting:\nId Ism Familiya\n1 Alisher Alisherov", remove_options)
            }
            else {
                let bool = true;
                let userinfo = text.split(" ")

                if (text == "/info") {
                    bot.sendMessage(chatId, "Bu bot sizga ballingiz haqida ma'lumot beradi!\nBuning uchun botga /ball ni yuboring", remove_options)
                }

                else if (text == "/clear") {
                    for (let i = 0; i < 51; i++) {
                        bot.deleteMessage(chatId, msg.message_id - i, remove_options)
                    }
                }

                else if (userinfo.length == 3) {
                    users.find(user => {
                        if (user[0] == userinfo[0] && user[1].toLowerCase() == userinfo[1] && user[2].toLowerCase() == userinfo[2]) {
                            bool = false;
                            bot.sendMessage(chatId, `Sizning balingiz: ${user[3]} ball`, remove_options)
                        }
                    })
                    if (bool) {
                        bot.sendMessage(chatId, "Bunday user ma'lumotlari mavjud emas!", remove_options)
                    }
                } else {
                    if (text != "/start") {
                        bot.sendMessage(chatId, "Bunday so'rov mavjud emas!", remove_options)
                    }
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    }
})