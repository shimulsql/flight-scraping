import moment from 'moment';

export default (data) => {
  let allEntries = onlyEconomyClass(data);
  let flights = [];

  // console.log(allEntries);return;

  allEntries.forEach(entry => {
    entry.itineraryPart.forEach(part => {
      if(part.segments && part.segments.length > 0){
        part.segments.forEach(segment => {
          if(segment.flight){
            flights.push({
              flightCode: segment.flight.airlineCode,
              flightNumber: segment.flight.flightNumber,
              origin: segment.origin,
              destination: segment.destination,
              arrival: moment(segment.arrival).format('YYYY-MM-DD HH:mm:ss'),
              departure: moment(segment.departure).format('YYYY-MM-DD HH:mm:ss'),
              arrival_at: moment(segment.arrival).format('HH:mm'),
              departure_at: moment(segment.departure).format('HH:mm'),
            });
          }
        })
      }
    })
  });

  return flights;
}

function onlyEconomyClass(data){
  return data.unbundledOffers.flat().filter(x => x.cabinClass == 'Economy');
}