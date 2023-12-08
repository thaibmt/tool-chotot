const browserObject = require('./browser');
const scraperController = require('./pageController');
const cron = require('node-cron');

const main = function () {
    //Start the browser and create a browser instance
    let browserInstance = browserObject.startBrowser();

    // Pass the browser instance to the scraper controller
    scraperController(browserInstance)
}
cron.schedule('*/5 * * * *', () => {
    console.log('Cron job is running every 10 minutes.');
    main();
    // Thêm các thao tác bạn muốn thực hiện sau mỗi 10 phút ở đây
});