const { read_file, write_file } = require("./fs/fs_api");
const bcrypt = require('bcryptjs');
const TelegramApi = require("node-telegram-bot-api");
require('dotenv').config()
let hashPsw, salt, admin1 = false, m = [5, 30, 30], l
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
])

const options = {
    reply_markup: JSON.stringify({
        keyboard: [
            [{ text: "userlar ro'yhati" }, { text: "user qo'shish" }],
            [{ text: "userni o'chirish" }, { text: "ball kiritish" }],
        ]
    }),
    parse_mode: 'HTML'
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
        admin1 = true
        if (admin.length == 0) {
            write_file("admin.json", [hashPsw])
        }
        else {
            let bool = true;
            for (let i of admin) {
                if (await bcrypt.compare(`${chatId}`, i)) {
                    bool = false;
                }
            }
            if (bool) {
                admin.push(hashPsw)
                write_file("admin.json", admin)
            }
        }
    }


    text = text.toLowerCase()

    if (text == "/start") {
        const user = msg.from.first_name
        const lastname = msg.from.last_name
        bot.sendMessage(chatId, `Assalomu alaykum ${user} ${lastname} botga xush kelibsiz!!!\n/info bot haqida\n/ball ball haqida ma'lumot\n/clear botni tozalash`, remove_options)
    }

    for (let i of admin) {
        if (await bcrypt.compare(`${chatId}`, i)) {
            admin1 = true
        }
    }

    if (admin1) {
        try {
            if (start == "userlar ro'yhati" && text == "userlar ro'yhati") {
                bot.sendMessage(chatId, "Ro'yhatda hech qanday o'zgarish bo'lmasa,\n<b><i>userlar ro'yhati</i></b>     tugmasi ishga tushmaydi.\nBuning uchun /userlist ni bosing", { parse_mode: 'HTML' })
            }

            if (start != text) {
                if (text == `parol: ${ADMIN}`.toLowerCase()) {
                    const user = msg.from.first_name
                    const lastname = msg.from.last_name
                    bot.sendMessage(chatId, `Assalomu alaykum ${user} ${lastname} admin panelga xush kelibsiz!!! `, options)
                }

                else if (text == "/info") {
                    bot.sendMessage(chatId, "Bu bot orqali siz userlarni qo'shishingiz, o'chirishingiz va ball kiritishingiz mumkin. Shuningdek userlar ro'yhatini ham ko'rishingiz mumkin. Buning uchun pastdagi buttonlarni bosing va komandalarni kiriting!!!", options)
                }

                else if (text == "userlar ro'yhati") {
                    let content = "", s = "";
                    let info = ['id', 'ism', 'familiya', 'ball']
                    for (let i in info) {
                        s += info[i]
                        l = String(info[i]).length
                        for (let j = 0; j < m[i] - l; j++) {
                            s += " "
                        }
                    }
                    users.forEach((user, index) => {
                        content += `<pre><i>${s}</i></pre>`;
                        s = ""
                        for (let i in user) {
                            s += user[i]
                            l = String(user[i]).length
                            for (let j = 0; j < m[i] - l; j++) {
                                s += " "
                            }
                        }
                        user[0] = index + 1;
                        return
                    })
                    bot.sendMessage(chatId, content, options)
                    write_file("users.json", users)
                    write_file("start.json", [text])
                }

                else if (text == "/userlist") {
                    let content = "", s = "";
                    let info = ['id', 'ism', 'familiya', 'ball']
                    for (let i in info) {
                        s += info[i]
                        l = String(info[i]).length
                        for (let j = 0; j < m[i] - l; j++) {
                            s += " "
                        }
                    }
                    users.forEach((user) => {
                        content += `<pre><i>${s}</i></pre>`;
                        s = ""
                        for (let i in user) {
                            s += user[i]
                            l = String(user[i]).length
                            for (let j = 0; j < m[i] - l; j++) {
                                s += " "
                            }
                        }
                        return
                    })
                    bot.sendMessage(chatId, content, options)
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
                            if (user[0] == message[1]) {
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
        }
    } else {
        try {
            if (text == "/ball") {
                bot.sendMessage(chatId, "Id ism va familiyangizni quyidagicha kiriting:\nId Ism Familiya\n1 Alisher Alisherov", remove_options)
            }

            else if (text == "/reload") {
                bot.sendMessage(chatId, "loaded", remove_options)
            }

            else {
                let bool = true;
                let userinfo = text.split(" ")

                if (text == "/info") {
                    bot.sendMessage(chatId, "Bu bot sizga ballingiz haqida ma'lumot beradi!\nBuning uchun botga /ball ni yuboring", remove_options)
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
        }
    }
})