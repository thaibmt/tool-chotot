const choTotScraper = require('./choTotScraper');
const bonBanhScraper = require('./bonBanhScraper');
const carplaScraper = require('./carplaScraper');
const carmudiScraper = require('./carmudiScraper');
const sendMessage = require('./sendTelegram');
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Swap array[i] and array[j]
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
async function scrapeAll(browserInstance) {
    let browser, data = [];
    try {
        browser = await browserInstance;
        for (let item of [
            { district: 'hcm', url: 'https://xe.chotot.com/mua-ban-oto-tp-ho-chi-minh?price=15000000-200000000&page=1' },
            { district: 'dongnai', url: 'https://xe.chotot.com/mua-ban-oto-dong-nai?price=15000000-200000000&page=1' },
            { district: 'binhthuan', url: 'https://xe.chotot.com/mua-ban-oto-binh-thuan?price=15000000-200000000&page=1' },
            { district: 'vungtau', url: 'https://xe.chotot.com/mua-ban-oto-ba-ria-vung-tau?price=15000000-200000000&page=1' },
        ]) {
            try {
                choTotScraper.url = item.url;
                choTotScraper.district = item.district;
                let result = await choTotScraper.scraper(browser, item.url);
                data = [...data, ...result]
            } catch (err) {
                console.log(err)
            }
        }
        shuffleArray(data);

        if (data.length > 0) {
            console.log({ data })
            for (let car of data) {
                await sendMessage(car)
            }
            console.log("Hoàn thành.");
        } else {
            console.log("Không có dữ liệu mới nào!");
        }
        await browser.close();
    }
    catch (err) {
        console.log("Could not resolve the browser instance => ", err);
    }
}

module.exports = (browserInstance) => scrapeAll(browserInstance)