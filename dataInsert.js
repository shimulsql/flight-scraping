import payloadGenerator from './src/payloadGenerator.mjs';
import getSearchKey from './src/getSearchKey.mjs';
import getFlightList from './src/getFlightList.mjs';
import moment from 'moment/moment.js';
import { db } from './database.mjs';

export default (queries) => (new Promise(async (resolve, reject) => {

  let payloads = queries.map((query) => {
    return payloadGenerator(query);
  }).flat();

  console.log("Total payloads for search key: " + payloads.length);

  let searchKeys = await Promise.all(payloads.map(async (payload, index) => {
    return await getSearchKey(payload, index);
  }))


  const flights = Array.from(await Promise.all(searchKeys.map(async (key, index) => {
    if (key) {
      return await getFlightList(key, index);
    }
  }))).flat();

  // data collect
  var dataToInsert = [];

  dataToInsert = await Promise.all(
    flights.map(async ({ flight, journey, price }) => {
      var flightCodeId = await db('flight_code').where('flight_code', flight.code).first();
      var from = await db('location').where('location_name', journey.from).first();
      var to = await db('location').where('location_name', journey.to).first();

      if (!to) {
        console.log(flight.name);
        console.log(journey.to);
        console.log(to);
      }

      return ({
        flight_no: flight.code + flight.number,
        aircraft_version: flight.version,
        flight_date: moment(journey.arrival_date).format("YYYY-MM-DD"),
        flight_time_skd: journey.departure_at.replace(':', ''),
        flight_code_id: flightCodeId?.flight_code_id || null,
        origin_station: from.location_id,
        destination1: to.location_id,
        arrival_scheduledTime: journey.arrival_date,
        departure_scheduledTime: journey.departure_date,
        price: price.total,
        tax: price.tax,
      })
    })
  )

  // console.log(dataToInsert);

  // insert to db
  await db('flights_arrival').insert(dataToInsert);

  console.log("Data inserted | rows: " + dataToInsert.length);

  resolve();

})) 