import axios from "axios"
import formatResults from "./helpers/formatResults.mjs";

export default (key, index) => (new Promise(async (resolve, reject) => {

  const url = "https://production.gozayaan.com/api/flight/v2.0/search/" + key;

  setTimeout( async () => {
    try {

      const axiosOptions = {
        method: "get",
        url: url,
        headers: {
          "Content-Type": "application/json",
        },
        json: true,
      };
  
      const response = await axios(axiosOptions);
      const data = response.data;
  
      if(data.error.code == 400) {
        console.log('Error: ' + JSON.stringify(data.error));
        return;
      }
  
      console.log(`Found ${data.result.results.length} flights | ${data.result.search_params.trips[0].origin} - ${data.result.search_params.trips[0].destination} | ${data.result.search_params.trips[0].preferred_time}`);
  
      const formattedData = await formatResults(data.result);
      resolve(formattedData);
  
    } catch (error) { }

  }, index * 1000);


}))