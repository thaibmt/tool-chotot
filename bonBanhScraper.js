const fs = require('fs');
const START_PAGE = 1, PAGE_END = 2;
const scraperObject = {
    url: 'https://bonbanh.com/tp-hcm/oto/page,' + START_PAGE,
    async scraper(browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url);
        let scrapedData = [];
        function delay(time) {
            return new Promise(function (resolve) {
                setTimeout(resolve, time)
            });
        }
        function writeJson(filename, scrapedData) {
            fs.writeFile(filename, JSON.stringify(scrapedData), 'utf8', function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The data has been scraped and saved successfully! View it at './" + filename + "'");
            });
        }
        async function scrapeCurrentPage() {
            // Wait for the required DOM to be rendered
            await page.waitForSelector('#footer');
            // Get the link to all the required books
            let urls = await page.$$eval('li.car-item', links => {
                // Extract the links from the data
                links = links.map(el => el.querySelector('a')?.href)
                return links;
            });
            // Loop through each of those links, open a new page instance and get the relevant data from them
            let pagePromise = (link) => new Promise(async (resolve, reject) => {
                let newPage = await browser.newPage();
                await newPage.goto(link);
                let name = await newPage.$eval('.title h1', item => {
                    return item.textContent.replaceAll('\t', '').replaceAll('\n', '').trim()
                });
                let image = await newPage.$eval('#img1', item => {
                    return item.src
                });
                let description = await newPage.$eval('.des_txt', item => {
                    return item.textContent.replaceAll('\t', '').replaceAll('\n', '').trim();
                });
                let attributes = await newPage.$$eval('#mail_parent', items => {
                    let attributes = []
                    for (let item of items) {
                        attributes.push(item.textContent.replaceAll('\t', '').replaceAll('\n', '').trim())
                    }
                    return attributes
                })
                await page.close();
                let data = {
                    name: name.split('-')[0],
                    price: name.split('-')[1],
                    image,
                    description,
                    link,
                    attributes,
                    address
                }
                resolve(data);
                await newPage.close();
            });

            // for (link in urls) {
            let currentPageData = await pagePromise(urls[0]);
            scrapedData.push(currentPageData);
            // console.log(currentPageData);
            // await delay(5000); // set delay
            // }
            return console.log(scrapedData)
            // When all the data on this page is done, click the next button and start the scraping of the next page
            // You are going to check if this button exist first, so you know if there really is a next page.
            let nextButtonExist = false, current_page;

            try {
                current_page = await page.$eval('.paging .next > a', a => a.getAttribute('href').split(':').pop());
                nextButtonExist = true;
            }
            catch (err) {
                nextButtonExist = false;
            }
            if (nextButtonExist && current_page <= PAGE_END) {
                await page.click('.paging .next > a');
                return scrapeCurrentPage(); // Call this function recursively
            } else {
                writeJson(`page_${START_PAGE}_${PAGE_END}.json`, scrapedData)
            }
            await page.close();
            return scrapedData;
        }
        let data = await scrapeCurrentPage();
        // console.log(data);
        return data;
    }
}

module.exports = scraperObject;