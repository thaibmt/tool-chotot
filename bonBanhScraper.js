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
        let scrapedData = [], urlData = [], scapedUrl = getScapedLink(`data/bonbanh-${this.district}.json`);
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
            await page.waitForSelector('#footer');
            console.log(scraperObject.url)
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
                let image;
                try {
                    image = await newPage.$eval('#img1', item => {
                        return item.src
                    });
                } catch (error) {
                    reject(error)
                }
                let contact = await newPage.$eval('.contact-txt', item => {
                    return {
                        phone: item.querySelector('.cphone').textContent.trim(),
                        address: item.textContent.trim()
                    }
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
                let data = {
                    name: name.split('-')[0],
                    price: name.split('-')[1],
                    image,
                    description,
                    link,
                    // attributes,
                    phone: contact.phone,
                    address: contact.address
                }
                resolve(data);
                await newPage.close();
            });

            for (let link of urls) {
                if (scapedUrl.includes(link)) {
                    start_page = PAGE_END + 1;
                    break;
                }
                try {
                    let currentPageData = await pagePromise(link);
                    scrapedData.push(currentPageData);
                    urlData.push(link)
                } catch (err) {
                    console.log(err)
                }

            }
            if (start_page++ < PAGE_END) {
                scraperObject.url = scraperObject.url.replace(`page,${start_page - 1}`, `page,${start_page}`)
                await page.goto(scraperObject.url, { waitUntil: "networkidle2" });
                return scrapeCurrentPage(); // Call this function recursively
            } else {
                if (urlData.length) {
                    saveToJsonFile(`bonbanh-${scraperObject.district}.json`, urlData)
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