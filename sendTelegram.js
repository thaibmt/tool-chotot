const fetch = require('node-fetch');

const botToken = '5244823807:AAFkXn5tvh4g_LP5Gj9xSaRGfhJQMAtfDD8';
const chatId = '@tool_chotot';

async function sendMessage(data) {
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;

    // Thay thế 'text' và 'photo' bằng nội dung và hình ảnh bạn muốn chia sẻ
    // Information to be included in the caption
    const caption =
        `<b>🆕${data.name}</b>\n
    <b>✅Giá:</b> ${data.price}\n
    <b>✅Địa chỉ:</b>${data.address}\n\n
    <a href="${data.link}">🌍Xem chi tiết</a>`;
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
        console.log(result);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

module.exports = sendMessage;