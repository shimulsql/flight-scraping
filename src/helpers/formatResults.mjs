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
        arrival_time: segment.arrival_time,
        departure_time: segment.departure_time,
      },
      price: {
        total: result.total_price,
        tax: result.total_taxes,
      }

    }

  })

  resolve(data);
}))