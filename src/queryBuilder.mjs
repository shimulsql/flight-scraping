import { db } from "../database.mjs";
import moment from "moment";

export default () => (new Promise(async (resolve, reject) => {
  let queries = [];
  let locations = [];

  try {
    let locationRows = await db('location').select('location_name').whereNot('location_name', 'DAC');
    
    locations = locationRows.map((loc) => {
      return loc.location_name;
    })

    // from DAC to all
    locations.forEach((loc) => {
      buildQuery('DAC', loc, queries)
    })


    console.log('Total Queries: ' + queries.length);

    resolve(queries);

  } catch (error) { console.log(error.message) }

}))

const buildQuery = (from, to, queries) => {
  queries.push({
    from: from,
    to: to,
    date: [moment().format('YYYY-MM-DD'), moment().add(5, 'day').format('YYYY-MM-DD')]
  });
}