export default ({from, to, date}) => {
  return { "adult": 1, "child": 0, "child_age": [], "infant": 0, "cabin_class": "Economy", "trips": [{ "origin": from, "destination": to, "preferred_time": date }], "currency": "BDT", "region": "BD" }
}