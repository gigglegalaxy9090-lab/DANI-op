const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN || 'YOUR_TOKEN';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `
🤖 *DANI OS Bot*

به ربات شخصی‌سازی خوش آمدی!

🔹 /build - ساخت ربات جدید
🔹 /games - مدیریت بازی‌ها
🔹 /apps - مدیریت برنامه‌ها
🔹 /help - راهنما
    `, { parse_mode: 'Markdown' });
});

bot.onText(/\/build/, (msg) => {
    bot.sendMessage(msg.chat.id, '📥 لطفاً توکن ربات را از @BotFather بگیرید:');
});

console.log('✅ ربات تلگرام اجرا شد!');
