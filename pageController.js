const choTotScraper = require('./choTotScraper');
const bonBanhScraper = require('./bonBanhScraper');
const carplaScraper = require('./carplaScraper');
const carmudiScraper = require('./carmudiScraper');
async function scrapeAll(browserInstance) {
    let browser;
    try {
        browser = await browserInstance;
        let choTotScrapedData = await choTotScraper.scraper(browser);
        // let carplaScrapedData = await carplaScraper.scraper(browser);
        // let bonBanhScrapedData = await bonBanhScraper.scraper(browser);
        // let carmudiScrapedData = await carmudiScraper.scraper(browser);
    }
    catch (err) {
        console.log("Could not resolve the browser instance => ", err);
    }
}

module.exports = (browserInstance) => scrapeAll(browserInstance)