const fs = require('fs');
const path = require('path');
const PAGE_END = 2;
let start_page = 1;
function getScapedLink(filePath) {
    try {
        // Đọc tệp JSON
        const data = fs.readFileSync(filePath, 'utf8');
        // Chuyển đổi dữ liệu JSON thành đối tượng JavaScript
        const jsonData = JSON.parse(data);
        // Kiểm tra nếu có mảng trong đối tượng JSON
        if (Array.isArray(jsonData)) {
            return jsonData;
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
}
const scraperObject = {
    url: '',
    district: '',
    async scraper(browser) {
        let page = await browser.newPage();
        await page.goto(this.url, { waitUntil: "networkidle2" });
        let scrapedData = [], urlData = [], scapedUrl = getScapedLink(`data/carmudi-${this.district}.json`);
        function saveToJsonFile(fileName, data) {
            // Đường dẫn đến thư mục "data"
            const dataFolderPath = path.join(__dirname, 'data');

            // Tạo đường dẫn đến tệp JSON trong thư mục "data"
            const filePath = path.join(dataFolderPath, fileName);

            try {
                // Kiểm tra xem thư mục "data" có tồn tại không
                if (!fs.existsSync(dataFolderPath)) {
                    // Nếu không tồn tại, tạo thư mục
                    fs.mkdirSync(dataFolderPath);
                }

                // Ghi dữ liệu vào tệp JSON
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

                console.log('Dữ liệu đã được lưu vào tệp JSON thành công.');
            } catch (error) {
                console.error('Lỗi khi lưu dữ liệu vào tệp JSON:', error);
            }
        }
        async function scrapeCurrentPage() {
            // Wait for the required DOM to be rendered
            await page.waitForSelector('div.carmudi-listing-item');

            // Get the link to all the required books
            let data = await page.$$eval('div.carmudi-listing-item', products => {
                let data = [], item = {}
                // Extract the links from the data
                for (let el of products) {
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
                        data.push(item);
                    }

                }
                return data
            });
            let temp = [];
            console.log({ data })
            for (let item of data) {
                if (scapedUrl.includes(item.link)) {
                    start_page = PAGE_END + 1;
                    break;
                }
                temp.push(item);
                urlData.push(item.link)
            }
            scrapedData.push(temp);
            if (start_page++ < PAGE_END) {
                scraperObject.url = scraperObject.url.replace(`&page=${start_page - 1}`, `&page=${start_page}`)
                await page.goto(scraperObject.url, { waitUntil: "networkidle2" });
                return scrapeCurrentPage(); // Call this function recursively
            } else {
                if (urlData.length) {
                    saveToJsonFile(`carmudi-${scraperObject.district}.json`, urlData)
                }
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