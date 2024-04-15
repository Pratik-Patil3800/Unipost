const puppeteer = require('puppeteer');

const fbpost = async (imagePath,caption) => {
    try{
        const browser=await puppeteer.launch({headless:false});
        const page=await browser.newPage();
        await page.goto("https://www.facebook.com/");
        await page.waitForSelector("#email");
        await page.type("#email","7666294612");
        await page.waitForSelector("#pass");
        await page.type("#pass","djp1223qq");
        await page.click(`[type="submit"]`);
        await page.waitForNavigation();
        await page.click('body');
        await page.$eval('[aria-label="Facebook"]', (div) => {
            div.click();
        });
        await page.waitForSelector('div[aria-label="Create a post"] > div:nth-child(2) > div:nth-child(2)');
        await page.$eval('div[aria-label="Create a post"] > div:nth-child(2) > div:nth-child(2)', (secondDiv) => {
            secondDiv.click();
        });
        await new Promise(resolve => setTimeout(resolve, 3000));
        const inputSelector = 'input[type="file"]';
        await page.waitForSelector(inputSelector);
        await page.type(inputSelector,'hiii');
        const elementHandle = await page.$('input[type="file"]');
        await elementHandle.uploadFile(imagePath);
        await new Promise(resolve => setTimeout(resolve, 4000));
        // await page.waitForSelector('[aria-label="Post"]');
        // await page.click('[aria-label="Post"]');
        // await browser.close();
    }
    catch(error){
        console.log(error);

    }
};
// fbpost("../stylesheet/test.jpg","hi");
module.exports = fbpost;
