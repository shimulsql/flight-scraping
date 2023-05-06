import moment from "moment";

export default (results) => (new Promise(async (resolve, reject) => {

  let data = results.map((result) => {

    let segment = result.flights[0].options[0].segments[0];
    let option = result.flights[0].options[0];

    return {
      flight: {
        name: segment.carrier.name,
        code: segment.carrier.code,
        number: segment.flight_number,
        version: segment.equipment,
      },
      journey: {
        from: result.flights[0].origin,
        to: result.flights[0].destination,
        arrival_date: option.arrival_time,
        departure_date: option.departure_time,
        arrival_at: moment(option.arrival_time).format('HH:mm'),
        departure_at: moment(option.departure_time).format('HH:mm'),
        
      },
      price: {
        total: result.total_price,
        tax: result.total_taxes,
      }

    }

  })

  resolve(data);
}))