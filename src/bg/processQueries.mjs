import payloadGenerator from './payloadGenerator.mjs'
import delay, { delayStatus } from '../helpers/delay.mjs';
import getFlight from './getFlight.mjs';
import store from './store.mjs';

export default (queries, delayTime, config) => (new Promise(async (resolve) => {
  
  try {

    await delay(delayTime);
    delayStatus(delayTime);

    const payloads = queries.map(query => {
      return payloadGenerator(query);
    }).flat()
  
    console.log(`Payloads for this operation: ${payloads.length}`);

    const flights = Array.from(await Promise.all(payloads.map((async (payload, i) => {
      let delay = config.waitServerRequestSecond * 1000 * i;
      return await getFlight(payload, delay);
    })))).flat();

    console.log('Ok');

    const stored = await store(flights);

    console.log(`Inserted: ${stored.count} rows | ${stored.at}`);

    resolve(stored.count);

  } catch (error) {
    
  }

}))
