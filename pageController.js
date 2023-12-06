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
        for (let url of [
            'https://xe.chotot.com/mua-ban-oto-tp-ho-chi-minh',
            'https://xe.chotot.com/mua-ban-oto-dong-nai',
            'https://xe.chotot.com/mua-ban-oto-binh-thuan',
            'https://xe.chotot.com/mua-ban-oto-ba-ria-vung-tau',
        ]) {
            console.log(url)
            try {
                choTotScraper.url = url + '?page=1';
                let result = await choTotScraper.scraper(browser, url);
                data = [...result]
            } catch (err) {
                console.log(err)
            }

        }
        // let chotot = await choTotScraper.scraper(browser,);
        // let carpla = await carplaScraper.scraper(browser);
        // let carmudi = await carmudiScraper.scraper(browser);
        // let bonbanh = await bonBanhScraper.scraper(browser);
        // data = [
        //     ...chotot,
        //     // ...carpla,
        //     // ...carmudi,
        //     // ...bonbanh
        // ];
        shuffleArray(data);
        console.log(data)
        sendMessage(data[0])

    }
    catch (err) {
        console.log("Could not resolve the browser instance => ", err);
    }
}

module.exports = (browserInstance) => scrapeAll(browserInstance)