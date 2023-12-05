const fs = require('fs');
const START_PAGE = 1, PAGE_END = 2;
const scraperObject = {
    url: 'https://www.carmudi.vn/xe-o-to/?page=' + START_PAGE,
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
            await page.waitForSelector('div.carmudi-listing-item');

            // Get the link to all the required books
            let data = await page.$$eval('div.carmudi-listing-item', products => {
                let data = [], item = {}
                // Extract the links from the data
                products.map(el => {
                    let attributes = [];
                    let a = el.querySelector('a');
                    if (a) {
                        el.querySelectorAll('ul.grid li').forEach(el => attributes.push(el.textContent))
                        item = {
                            name: a?.getAttribute('title'),
                            link: a?.href,
                            price: el.querySelector('h3')?.textContent.replaceAll('\n', '').trim(),
                            attributes,
                            image: el.querySelector('img')?.src,
                            address: el.querySelector('.px-4')?.childNodes[3]?.textContent.replaceAll('\n', '').trim(),
                        }
                        data.push(item)
                    }

                })
                return data
            });
            scrapedData = [...scrapedData, ...data];
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