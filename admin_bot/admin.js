// 55294

const { read_file, write_file } = require("./fs/fs_api");
const TelegramApi = require("node-telegram-bot-api");
require('dotenv').config()
const api = process.env.TOKEN;
const bot = new TelegramApi(api, { polling: true })

let [month, day, year] = new Date().toLocaleDateString("en-US").split("/");
function CreateKeyBoard(arr1, arr2) {
    let key = []
    let board;
    let keyBoard;
    let k = 0
    for (let i = 0; i < arr2.length; i++) {
        board = []
        for (let j = 0; j < arr2[i]; j++) {
            keyBoard = {}
            keyBoard.text = arr1[k]
            board.push(keyBoard)
            k++;
        }
        key.push(board)
    }

    options = {
        reply_markup: JSON.stringify({
            keyboard: key,
            resize_keyboard: true
        })
    }
    return options
}

const menu = CreateKeyBoard(["Operatsion Sistemalar(OS)", "Arxivlar paroli", "Arxivdan chiqarish qo'llanma", "📊Statistika"], [1, 1, 2])

const OS = CreateKeyBoard(["Windows", "Linux", "MacOS", "Android OS", "🔙 Orqaga", "🔝 Asosiy Menyu"], [2, 1, 1, 2])

const Windows = CreateKeyBoard(["x32", "x64", "🔙 Orqaga", "🔝 Asosiy Menyu"], [2, 2])

const x32 = CreateKeyBoard(["Windows 10 | x32", "Windows 8 | x32", "Windows 7 | x32", "Windows Vista | x32", "Windows XP | x32", "Windows 98 | x32", "🔙 Orqaga", "🔝 Asosiy Menyu"], [1, 2, 1, 2, 2])

const Windows10 = CreateKeyBoard(["1507", "1511", "1607", "1703", "1709", "1803", "1809", "1903", "1909", "2004", "20H2", "21H1", "21H2", "🔙 Orqaga", "🔝 Asosiy Menyu"], [2, 3, 2, 1, 4, 1, 2])

const Windows8 = CreateKeyBoard(["Professional | x32", "Enterprice | x32", "🔙 Orqaga", "🔝Asosiy Menyu"], [1, 1, 2])

const Windows7 = CreateKeyBoard(["Ultimate", "🔙 Orqaga", "🔝 Asosiy Menyu"], [1, 2])

const WindowsXP = CreateKeyBoard(["Professional", "Chip", "🔙 Orqaga", "🔝 Asosiy Menyu"], [1, 1, 2])

const Windows98 = CreateKeyBoard(["Professional | x32", "Enterprice | x32", "🔙 Orqaga", "🔝 Asosiy Menyu"], [1, 1, 2])

// ----------------------------------------------------------

const x64 = CreateKeyBoard([
    "Windows 11", "Windows 10", "Windows 8", "Windows 7", "Windows Vista", "🔙 Orqaga", "🔝 Asosiy Menyu"], [3, 2, 2])

const Orginalobraz = CreateKeyBoard(["Windows 11 Russian Pro 21H2", "🔙 Orqaga", "🔝 Asosiy Menyu"], [1, 2])

const windows11 = CreateKeyBoard(["Orginal obraz", "Windows 11 by SmokieBlahBlah", "Windows 11 21H2 by Tatata", "Windows 11 21H2 by OneSmile", "Windows 11 Compact&Full by flibustier", "Windows 11 21H2 Pro Insider", "Windows 11 21H2 rus gx", "Windows 11 21H2 by Ovgorskiy", "Windows 11 21H2 Enterprice by Zosma", "Windows 11 IoT Enterprice by Xalex", "Windows 11 Pro 21H2 by OneSmile", "Windows 11 IP LTSC by Djannet", "🔙 Orqaga", "🔝 Asosiy Menyu"], [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2])

const windows10 = CreateKeyBoard(["1507 | x64", "1511 | x64", "1607 | x64", "1703 | x64", "1709 | x64", "1803 | x64", "1809 | x64", "1903 | x64", "1909 | x64", "2004 | x64", "20H2 | x64", "21H1 | x64", "21H2 | x64", "🔙 Orqaga", "🔝 Asosiy Menyu"], [2, 3, 2, 1, 4, 1, 2])

const windows8 = CreateKeyBoard(["Professional | x64", "Enterprice | x64", "🔙 Orqaga", "🔝Asosiy Menyu"], [1, 1, 2])

const windows7 = CreateKeyBoard(["Ultimate | x64", "🔙 Orqaga", "🔝 Asosiy Menyu"], [1, 2])

// -----------------------------------

const Linux = CreateKeyBoard(["Ubuntu", "Kali", "PureOS", "Debian", "CentOs", "Puppy", "BlackLab", "BunsenLabs", "Arch Linux", "Slackware", "Solus", "Bodhi Linux", "Xubuntu", "🔙 Orqaga", "🔝 Asosiy Menyu"], [2, 2, 3, 1, 3, 2, 2,])

const Android = CreateKeyBoard(["Android 9.0", "Prime OS", "Bliss OS", "🔙 Orqaga", "🔝 Asosiy Menyu"], [1, 1, 1, 2])
const Android9 = CreateKeyBoard(["32 bit", "64 bit", "🔙 Orqaga", "🔝 Asosiy Menyu"], [1, 1, 2])


let step_m = { menu, OS, Windows, x32, Windows10, Windows8, Windows7, WindowsXP, Windows98, x64, Orginalobraz, windows11, windows10, windows8, windows7, Linux, Android, Android9 }
let files = ["1507", "1511", "1607", "1703", "1709", "1803", "1809", "1903", "1909", "2004", "20H2", "21H1", "21H2", "Ubuntu", "Kali", "PureOS", "Debian", "CentOs", "Puppy", "BlackLab", "BunsenLabs", "Arch Linux", "Slackware", "Solus", "Bodhi Linux", "Xubuntu", "MacOS", "Bliss OS"]


let start = []
let step = 0
let users = read_file("users.json")

bot.on("message", msg => {
    let key_board;
    try {
        let text = msg.text;
        const chatId = msg.chat.id
        if (text == "/start") {
            if (users.length == 0) {
                users.push([chatId, month, day, year])
                write_file("users.json", users)
            } else {
                let bool = true;
                for (let i of users) {
                    if (i[0] == chatId) {
                        bool = false;
                    }
                }
                if (bool) {
                    users.push([chatId, month, day, year])
                    write_file("users.json", users)
                }
            }

            bot.sendMessage(chatId, "Assalomu alaykum", menu)
            key_board = "menu"
        }
        else if (text == "Operatsion Sistemalar(OS)") {
            bot.sendMessage(chatId, "Operatsion Sistemalar(OS)", OS)
            key_board = "OS"
        }
        else if (text == "Windows") {
            bot.sendMessage(chatId, "Windows", Windows)
            key_board = "Windows"
        }
        else if (text == "x32") {
            bot.sendMessage(chatId, "x32", x32)
            key_board = "x32"
        }
        else if (text == "Windows 10 | x32") {
            bot.sendMessage(chatId, "Windows 10 | x32", Windows10)
            key_board = "Windows10"
        }
        else if (text == "Windows 8 | x32") {
            bot.sendMessage(chatId, "Windows 10 | x32", Windows8)
            key_board = "Windows8"
        }
        else if (text == "Windows 7 | x32") {
            bot.sendMessage(chatId, "Windows 10 | x32", Windows7)
            key_board = "Windows7"
        }
        else if (text == "Windows XP | x32") {
            bot.sendMessage(chatId, "Windows 10 | x32", WindowsXP)
            key_board = "WindowsXP"
        }
        else if (text == "Windows 98 | x32") {
            bot.sendMessage(chatId, "Windows 10 | x32", Windows98)
            key_board = "Windows98"
        }

        else if (text == "x64") {
            bot.sendMessage(chatId, "x32", x64)
            key_board = "x32"
        }
        else if (text == "Windows 11") {
            bot.sendMessage(chatId, "Windows 11", windows11)
            key_board = "windows11"
        }
        else if (text == "Windows 10") {
            bot.sendMessage(chatId, "Windows 10", windows10)
            key_board = "windows10"
        }
        else if (text == "Windows 8") {
            bot.sendMessage(chatId, "Windows 8", windows8)
            key_board = "windows8"
        }
        else if (text == "Windows 7") {
            bot.sendMessage(chatId, "Windows 7", windows7)
            key_board = "windows7"
        }
        else if (text == "Orginal obraz") {
            bot.sendMessage(chatId, "Orginal obraz", Orginalobraz)
            key_board = "Orginalobraz"
        }

        else if (text == "Linux") {
            bot.sendMessage(chatId, "Linux", Linux)
            key_board = "Linux"
        }
        else if (text == "Android OS") {
            bot.sendMessage(chatId, "Android", Android)
            key_board = "Android"
        }
        else if (text == "Android 9.0") {
            bot.sendMessage(chatId, "Android", Android9)
            key_board = "Android9"
        }
        else if (text == "🔝 Asosiy Menyu") {
            bot.sendMessage(chatId, "🔝 Asosiy Menyu", menu)
        }

        else if (text == "Arxivlar paroli") {
            bot.sendPhoto(chatId, "modul/arxivlar_paroli.jpg", { caption: "Arxiv paroli rasmda ko'rsatilgan 😊" })
        }

        else if (text == "Arxivdan chiqarish qo'llanma") {
            bot.sendPhoto(chatId, "modul/arxiv.jpg", { caption: "Ko`p faylli arxivlarni arxivdan xalos qilish uchun qo`llanma !!!" })
        }
        else if (text == "32 bit") {
            bot.sendPhoto(chatId, "modul/32bit.jpg")
            bot.sendDocument(chatId, "modul/document.pdf")
            key_board = true
        }
        else if (text == "64 bit") {
            bot.sendPhoto(chatId, "modul/64bit.jpg")
            bot.sendDocument(chatId, "modul/document.pdf")
            key_board = true
        }
        else if (text == "Windows Vista | x32") {
            bot.sendPhoto(chatId, "modul/windows vista.jpg")
            bot.sendDocument(chatId, "modul/document.pdf")
            key_board = true
        }
        else if (text == "Ultimate"){
            bot.sendPhoto(chatId, "modul/ultimate.jpg")
            bot.sendDocument(chatId, "modul/document.pdf")
            key_board = true
        }
        else if (text == "Prime OS") {
            bot.sendPhoto(chatId, "modul/primeos.jpg")
            bot.sendDocument(chatId, "modul/document.pdf")
            key_board = true
        }
        else if (text == "📊Statistika") {
            let start_bot = (month - users[0][1]) * 31 + day - users[0][2] + (year - users[0][3]) * 365
            let y, m, d, l = 0, one = 0;
            if (month == 1) {
                y = year - 1;
                m = 12;
            } else {
                y = year;
                m = month - 1;
            }
            for (let i in users) {
                if (users[i][1] >= m && users[i][3] >= y) {
                    l = users.length - i;
                    break;
                }
            }
            if (day == 1) {
                m = month - 1;
                d = 30;
            } else {
                m = month;
                d = day-1;
            }
            for (let i in users) {
                if (users[i][1] >= m && users[i][2] >= d && users[i][3] >= year) {
                    one = users.length - i;
                    break;
                }
            }
            bot.sendMessage(chatId, `👥 Botdagi obunachilar: ${users.length}\n\n🔜 Oxirgi 24 soatda: ${one} ta obunachi qo'shildi\n🔝 Oxirgi 1 oyda: ${l} ta obunachi qo'shildi\n📆 Bot ishga tushganiga: ${start_bot} kun bo'ldi\n\n📊  @UsefulOS_bot statistikasi`)
        }

        else if (text == "🔙 Orqaga") {
            for (let i in start) {
                if (i == step - 1) {
                    for (let j in step_m) {
                        if (j == start[i]) {
                            bot.sendMessage(chatId, "🔙 Orqaga", step_m[j])
                        }
                    }
                    start.splice(step, 1)
                    break;
                }
            }
            if (step > 0) {
                step -= 1
            }
        }
        if (text != "🔙 Orqaga" && key_board != undefined) {
            let bool = true;
            for (let i of start) {
                if (i == key_board) {
                    bool = false;
                }
            }
            if (bool) {
                start.push(key_board)
                step += 1
            }
        }

        let bool = true;
        if (key_board == undefined) {
            for (let i of files) {
                if (text == i) {
                    bool = false;
                    i = i.toLowerCase()
                    bot.sendPhoto(chatId, `modul/${i}.jpg`)
                    bot.sendDocument(chatId, "modul/document.pdf")
                    bot.sendDocument(chatId, "modul/document.pdf")
                }
            }
            if (text != "🔙 Orqaga" && bool == true) {
                bot.sendMessage(chatId, `❌ Noma'lum buyruq!\n\nSiz to'g'ridan-to'g'ri bot chatiga xabar yubordingiz, yokibot tuzilishi yaratuvchisi tomonidan o'zgartirilgan boʻlishi mumkin.\n\nℹ️ Xabarlarni to'g'ridan-to'g'ri botga yubormang yoki /start orqali bot menyusini yangilang`)
            }
        }

    } catch (error) {
        console.log(error);
    }
})