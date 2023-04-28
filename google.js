import puppeteer from "puppeteer";

async function run(){
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto("https://www.google.com/");

    await page.waitForSelector("input[type='submit']");

    let searchBtnText = await page.$eval("input[type='submit']", (e) => {
      return e.value;
    })

    console.log(searchBtnText);

    await browser.close();

  } catch (error) {
    console.log(error);
  }
}

run();