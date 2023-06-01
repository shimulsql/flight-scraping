import { db } from "../../database.mjs";
import moment from "moment";

export default (flights) => (new Promise(async resolve => {
  let dataToInsert = [];

  try {
    dataToInsert = await Promise.all(
      flights.map(async flight => {
        return await preProcessStore(flight);
      })
    );
  
    if(dataToInsert.length > 0){
      await db('flights').insert(dataToInsert);
    }
    
  } catch (error) {
    console.log("Insert error: " + error.message);
  }

  resolve({
    count: dataToInsert.length,
    at: moment().format('DD-MM-YYYY hh:mm')
  })

}))

const preProcessStore = (data) => (new Promise(async resolve => {
  var flightCodeId = await db('flight_code').where('flight_code', data.flightCode).first();
  var from = await db('location').where('location_name', data.origin).first();
  var to = await db('location').where('location_name', data.destination).first();

  resolve({
    flight_no: data.flightCode + data.flightNumber,
    flight_date: moment(data.arrival).format("YYYY-MM-DD"),
    flight_time_skd: data.departure_at.replace(':', ''),
    flight_code_id: flightCodeId?.flight_code_id || null,
    origin_station: from.location_id,
    destination1: to.location_id,
    arrival_scheduledTime: data.arrival,
    departure_scheduledTime: data.departure,
  })
}))