const browserObject = require('./browser');
const scraperController = require('./pageController');
const cron = require('node-cron');
const moment = require('moment-timezone');

const main = function () {
    //Start the browser and create a browser instance
    let browserInstance = browserObject.startBrowser();

    // Pass the browser instance to the scraper controller
    scraperController(browserInstance)
}
console.log('Starting App ... ')
let currentTimeInVietnam = moment().format('HH:mm:ss DD/MM/YYYY');
console.log('Ứng dụng được chạy lúc:' + currentTimeInVietnam);
main();
cron.schedule('*/30 * * * *', () => {
    // Lấy thời gian hiện tại theo múi giờ Việt Nam
    currentTimeInVietnam = moment().format('HH:mm:ss DD/MM/YYYY');
    console.log('Ứng dụng được chạy lúc:' + currentTimeInVietnam);
    main();
});