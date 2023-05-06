import moment from "moment";

export default (results) => (new Promise(async (resolve, reject) => {

  let data = results.map((result) => {

    let segment = result.flights[0].options[0].segments[0];

    return {
      flight: {
        name: segment.carrier.name,
        code: segment.carrier.code,
        number: segment.flight_number,
        version: segment.equipment,
      },
      journey: {
        from: segment.origin,
        to: segment.destination,
        arrival_date: segment.arrival_time,
        departure_date: segment.departure_time,
        arrival_at: moment(segment.arrival_time).format('HH:mm'),
        departure_at: moment(segment.departure_time).format('HH:mm'),
        
      },
      price: {
        total: result.total_price,
        tax: result.total_taxes,
      }

    }

  })

  resolve(data);
}))