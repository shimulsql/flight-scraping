import moment from "moment";

export default (data) => (new Promise(async (resolve, reject) => {

  let filtered = data.results.map((result) => {

    let flights = [];

    result.flights.map((flight, i) => {
      let segment = flight.options[0].segments[0];
      let option = flight.options[0];

      flights.push({
        flight: {
          name: segment.carrier.name,
          code: segment.carrier.code,
          number: segment.flight_number,
          version: segment.equipment,
        },
        journey: {
          from: data.search_params.trips[i].origin,
          to: data.search_params.trips[i].destination,
          arrival_date: option.arrival_time,
          departure_date: option.departure_time,
          arrival_at: moment(option.arrival_time).format('HH:mm'),
          departure_at: moment(option.departure_time).format('HH:mm'),

        },
        price: {
          total: result.total_price,
          tax: result.total_taxes,
        }

      })

    })

    return flights;

  })

  resolve(filtered);
}))