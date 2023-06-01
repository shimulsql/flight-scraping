import dateRange from "../helpers/dateRange.mjs";

export default ({from, to, date}) => {
  let dates = dateRange(date[0], date[1]);

  let payloads = dates.map(date => {
    return {"operationName":"bookingAirSearch","variables":{"airSearchInput":{"cabinClass":"Economy","awardBooking":false,"promoCodes":[],"searchType":"BRANDED","itineraryParts":[{"from":{"useNearbyLocations":false,"code": from},"to":{"useNearbyLocations":false,"code": to},"when":{"date": date}},{"from":{"useNearbyLocations":false,"code": to},"to":{"useNearbyLocations":false,"code": from},"when":{"date": date}}],"passengers":{"ADT":1},"pointOfSale":"BD"}},"extensions":{},"query":"query bookingAirSearch($airSearchInput: CustomAirSearchInput) {\n  bookingAirSearch(airSearchInput: $airSearchInput) {\n    originalResponse\n    __typename\n  }\n}\n"}
  })

  return payloads;
}