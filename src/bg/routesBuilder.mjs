import moment from "moment";

export default (config) => {
  const locations = [
    "JED",
    "RUH",
    "DMM",
    "KWI",
    "DOH",
    "DXB",
    "AUH",
    "SHJ",
    "MCT",
    "CCU",
    "DEL",
    "KTM",
    "KUL",
    "SIN",
    "BKK",
    "LHR",
    "MAN",
    "IST",
    "YYZ",
  ]

  let routes = [];

  locations.forEach((value) => {
    routes.push(generate(value, 'DAC', config))
  })

  // reverse
  locations.forEach((value) => {
    routes.push(generate('DAC', value, config))
  })


  return routes;


}

const generate = (from, to) => {
  let dayFromStart = 0;
  let dateIncrease = 5;
  
  return {
    from: from,
    to: to,
    date: [moment().add(dayFromStart, 'day').format('YYYY-MM-DD'), moment().add(dayFromStart + dateIncrease, 'day').format('YYYY-MM-DD')]
  }
}