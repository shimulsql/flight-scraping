import dateRangeArray from "./helpers/dateRange.mjs"

export default ({from, to, date}) => {

  let dates = dateRangeArray(date[0], date[1]);

  let payloads = dates.map(date => {
    return { "adult": 1, "child": 0, "child_age": [], "infant": 0, "cabin_class": "Economy", "trips": [{ "origin": from, "destination": to, "preferred_time": date }, { "origin": to, "destination": from, "preferred_time": date }], "currency": "BDT", "region": "BD" }
  })

  return payloads;
}