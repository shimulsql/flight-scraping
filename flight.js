import puppeteer from "puppeteer";
import { db } from './database.mjs';
import moment from "moment";

let browser = null;
let results = [];
let pageCount = 1;

(new Promise ( async (resolve, reject) => {
  
  try{
    browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();
    

    await page.setViewport({
      height: 1000,
      width: 1920
    })

    page.setDefaultNavigationTimeout(60000);

    await page.goto('https://www.gozayaan.com/flight/list?adult=1&child=0&child_age=&infant=0&cabin_class=Economy&trips=DAC,CXB,2023-05-06');
    
    // wait for first xhr response from the server
    await page.waitForResponse(async res => {
      if(res.url().includes('https://production.gozayaan.com/api/') && res.status() == 200){

        // console.log(res.url());

        /**
         * Wait for the response which have flights data
         */
        
        try{
          let response = JSON.parse(await res.text())

          if(response?.result?.results?.length > 0){
            return true;
          }

        } catch (error) {
          // console.log(error)
        }
      }
    });


    let paginationEl = await page.$('.pagination');

    if(paginationEl != null){

      // getting the page count from pagination block
      pageCount = await page.evaluate(() => {
          return document.querySelectorAll('.pagination li')[document.querySelectorAll('.pagination li').length-2].textContent
      })
    }

    console.log('page count:' + pageCount);

    // scroll 5 times and wait 5 second each time
    if(pageCount == 1){
      for (let i = 0; i < 6; i++) {
        await page.evaluate('window.scrollBy(0, document.body.scrollHeight)');
        await page.waitForTimeout(3000);
      }
    }

    for (let i = 0; i < pageCount; i++) {
      await page.waitForSelector('.flight-card');
      results = results.concat(await extractedEvaluate(page));

      if(pageCount != i && pageCount != 1){
        try {
          await page.waitForSelector('.pagination .next-item', {
            timeout
          });
          await page.click('.pagination .next-item')
        } catch (error) {  }
      }
    }

    
    resolve(results)
    
  } catch(e) {
    
    reject(e);
    
  } finally {
    if(browser != null) {
      await browser.close();
    }
  }

})).then(async (data) => {

  if(process.env.APP_DEBUG == "true"){
    console.log(data);
    return;
  }

  // data collect
  var dataToInsert = [];

  dataToInsert = await Promise.all(
    data.map( async (item) => {
      var flightCodeId = await db('flight_code').where('flight_code_details', item.flight.name).first();
      var from = await db('location').where('location_name', item.flight.from).first();
      var to = await db('location').where('location_name', item.flight.to).first();
  
      var dateFrom = moment(item.flight.departure_at.date, "ddd, DD MMM, YYYY").format("YYYY-MM-DD");
      var dateTo = moment(item.flight.arrival_at.date, "ddd, DD MMM, YYYY").format("YYYY-MM-DD");
  
      return({
        flight_no: item.flight.no,
        aircraft_version: item.flight.version,
        flight_date: dateFrom,
        flight_time_skd: item.flight.departure_at.time.replace(':', ''),
        flight_code_id: flightCodeId?.flight_code_id || null,
        origin_station: from.location_id,
        destination1: to.location_id,
        departure_scheduledTime: dateFrom + ' ' + moment(item.flight.departure_at.time, 'HH:mm').format('HH:mm:ss'),
        arrival_scheduledTime: dateTo + ' ' + moment(item.flight.arrival_at.time, 'HH:mm').format('HH:mm:ss'),
        price: item.fare.price,
        tax: item.fare.tax,
      })
    } )
  )


  // insert to db
  await db('flights_arrival').insert(dataToInsert)


  await db.destroy();
  

});





async function extractedEvaluate(page) {

  return page.evaluate(() => {

    // helper functions 
    function parseText(e, selector, deep = false){
      let str = e.querySelector(selector)?.textContent;
      if(deep) str.replace(/[\n\s]*/g, '');

      return str.trim();
    }

    function parseDigits(str){
      return str.replace(/[^\d]/g, '')
    }

    let data = Array.from(document.querySelectorAll('.flight-card'), (e) => {
      let flightNoVer = e.querySelector('.airplane-model').textContent.replace(/[\n\s]*/g, '').split('|');

      return {
        flight: {
          name: parseText(e, '.airplane-name'),
          no: flightNoVer[0] ? flightNoVer[0] : null,
          version: flightNoVer[1] ? flightNoVer[1] : null,
          from: parseText(e, '.start-time .destination-text'),
          to: parseText(e, '.end-time .destination-text'),
          departure_at: {
            time: parseText(e, '.start-time .time-text'),
            date: parseText(e, '.start-time .day-text'),
          },
          arrival_at: {
            time: parseText(e, '.end-time .time-text'),
            date: parseText(e, '.end-time .day-text')
          },
          duration: parseText(e, '.flight-duration-text'),
        },
        fare: {
          type: parseText(e, '.fare-info .passenger-type'),
          price: parseDigits(parseText(e, '.fare-info .flight-price.text-center')),
          tax: parseDigits(parseText(e, '.fare-info .flight-price.text-right', true)),
        }
      }
    })


    return data;
  })
}