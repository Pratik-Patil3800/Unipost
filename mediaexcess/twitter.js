const puppetter=require('puppeteer');

const twipost=async(imagePath,caption)=>{
    try{
        const browser=await puppetter.launch({
            headless:false,
            slowMo:20
        });
        const page=await browser.newPage();
        await page.goto("https://twitter.com/i/flow/login",{waitUntil:'networkidle2'});
        await page.waitForSelector('input[name="text"]');
        await page.type('input[name="text"]','@pratikp3800');
        await page.keyboard.press('Enter');
        await page.waitForSelector('input[name="password"]');
        await page.type('input[name="password"]','djp1223q');
        await page.keyboard.press('Enter');
        await page.waitForSelector('[aria-label="Post"]');
        await page.click('[aria-label="Post"]');
        const inputSelector='[aria-label="Post text"]';
        await page.waitForSelector(inputSelector);
        await page.type(inputSelector,caption);
        const elementHandle = await page.$("input[type=file]");
        await elementHandle.uploadFile(imagePath);
        await new Promise(resolve => setTimeout(resolve, 4000));
        await page.keyboard.down('Control');
        await page.keyboard.press('Enter');
        await page.keyboard.up('Control');
        await new Promise(resolve => setTimeout(resolve, 4000));
        await browser.close();
    }
    catch(error){
        console.log(error);
    }
};
// twipost("stylesheet/test.jpg","hi");
module.exports = twipost;