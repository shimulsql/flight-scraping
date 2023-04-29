import puppeteer from "puppeteer";

async function run(){
  try {
    const browser = await puppeteer.launch({
      headless: "new"
    });
    const page = await browser.newPage();

    await page.goto("https://www.gozayaan.com/flight/list?adult=1&child=0&child_age=&infant=0&cabin_class=Economy&trips=DAC,CXB,2023-05-01");

    console.log(await page.content());

    await browser.close();

  } catch (error) {
    console.log(error);
  }
}

run();