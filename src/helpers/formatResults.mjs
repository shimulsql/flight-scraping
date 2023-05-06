import moment from "moment";

export default (result) => (new Promise(async (resolve, reject) => {

  let data = result.results.map((item) => {

    let segment = item.flights[0].options[0].segments[0];
    let option = item.flights[0].options[0];

    return {
      flight: {
        name: segment.carrier.name,
        code: segment.carrier.code,
        number: segment.flight_number,
        version: segment.equipment,
      },
      journey: {
        from: result.search_params.trips[0].origin,
        to: result.search_params.trips[0].destination,
        arrival_date: option.arrival_time,
        departure_date: option.departure_time,
        arrival_at: moment(option.arrival_time).format('HH:mm'),
        departure_at: moment(option.departure_time).format('HH:mm'),
        
      },
      price: {
        total: item.total_price,
        tax: item.total_taxes,
      }

    }

  })

  resolve(data);
}))