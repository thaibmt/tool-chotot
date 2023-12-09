const fetch = require('node-fetch');

const botToken = '5244823807:AAFkXn5tvh4g_LP5Gj9xSaRGfhJQMAtfDD8';
const chatId = '@tool_chotot';
// const botToken = '1263823369:AAEj165AoVRSAhOc6i8lgecv87FulkEy74k';
// const chatId = '@choxegiatot';

async function sendMessage(data) {
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;
    let caption = `<b>🆕${data.name}</b>\n\n`;
    for (attribute of data.attributes) {
        let item = attribute.split(':');
        caption += item.length > 1 ? `\t<b>✅${item[0]}:</b> ${item[1]}\n` : `\t<b>✅${item[0]}:</b>\n`;
    }
    caption += `<b>✅Giá:</b> ${data.price}\n`;
    if (data.address) {
        caption += `<b>🕹️Địa chỉ:</b>${data.address}\n\n`;
    }
    caption += `<a href="${data.link}">🌍Xem chi tiết</a>`;
    const payload = {
        chat_id: chatId,
        photo: data.image,
        caption: caption,
        parse_mode: 'html'
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        return true;
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

module.exports = sendMessage;