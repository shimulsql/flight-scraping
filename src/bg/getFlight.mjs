import axios from "axios"
import delay from "../helpers/delay.mjs";
import filterData from "./filterData.mjs";

export default (payload, delayTime) => (new Promise(async resolve => {
  const axiosOptions = {
    headers: {
      'x-sabre-storefront': 'BGDX'
    },
    json: true,
  }
  let filtered = [];

  try {
    await delay(delayTime);

    const res = await axios.post("https://booking.biman-airlines.com/api/graphql", payload, axiosOptions);
    const data = res.data;
    const query = payloadExtractor(payload);
    
    const originalResponse = data.data.bookingAirSearch?.originalResponse;

    if(data.errors){

      console.log(`${query.from} <> ${query.to} [${query.date}]`);
      console.log(data.errors[0].message);

    } else if(originalResponse){

      filtered = filterData(originalResponse)
      console.log(`${query.from} <> ${query.to} [${query.date}] --> ${filtered.length}`);

    }

  } catch (error) {
    console.log('Axios Error: ' + error.message);
  } finally {
    resolve(filtered);
  }
  
}))


const payloadExtractor = (payload) => {
  const parts = payload.variables.airSearchInput.itineraryParts[0];
  
  return {
    from: parts.from.code,
    to: parts.to.code,
    date: parts.when.date
  }
}