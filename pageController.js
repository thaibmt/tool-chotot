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
        // 1. chotot
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
                if (result.length > 0) {
                    console.log({ result })
                    for (let car of result) {
                        await sendMessage(car)
                    }
                    console.log(bonBanhScraper.district + " - Có " + result.length + " tin");
                } else {
                    console.log(bonBanhScraper.district + " - Không có dữ liệu mới nào!");
                }
            } catch (err) {
                console.log(err)
            }
        }
        // 3. carmudi
        for (let item of [
            { district: 'hcm_dongnai_binhthuan_vungtau', url: 'https://www.carmudi.vn/xe-o-to/?city=2,75,77,60&price_min=50000000&price_max=200000000&page=1' },
        ]) {
            try {
                carmudiScraper.url = item.url;
                carmudiScraper.district = item.district;
                let result = await carmudiScraper.scraper(browser, item.url);
                if (result.length > 0) {
                    console.log({ result })
                    for (let car of result) {
                        await sendMessage(car)
                    }
                    console.log(bonBanhScraper.district + " - Có " + result.length + " tin");
                } else {
                    console.log(bonBanhScraper.district + " - Không có dữ liệu mới nào!");
                }
            } catch (err) {
                console.log(err)
            }
        }
        // 2. bon banh
        for (let item of [
            { district: 'hcm', url: 'https://bonbanh.com/tp-hcm/oto-gia-duoi-200-trieu/page,1' },
            { district: 'dongnai', url: 'https://bonbanh.com/dong-nai/oto-gia-duoi-200-trieu/page,1' },
            { district: 'vungtau', url: 'https://bonbanh.com/ba-ria-vung-tau/oto-gia-duoi-200-trieu/page,1' },
            { district: 'binhthuan', url: 'https://bonbanh.com/binh-thuan/oto-gia-duoi-200-trieu/page,1' },
        ]) {
            try {
                bonBanhScraper.url = item.url;
                bonBanhScraper.district = item.district;
                let result = await bonBanhScraper.scraper(browser, item.url);
                if (result.length > 0) {
                    console.log({ result })
                    for (let car of result) {
                        await sendMessage(car)
                    }
                    console.log(bonBanhScraper.district + " - Có " + result.length + " tin");
                } else {
                    console.log(bonBanhScraper.district + " - Không có dữ liệu mới nào!");
                }
            } catch (err) {
                console.log(err)
            }
        }
        console.log("Hoàn thành.");

        await browser.close();
    }
    catch (err) {
        console.log("Could not resolve the browser instance => ", err);
    }
}

module.exports = (browserInstance) => scrapeAll(browserInstance)