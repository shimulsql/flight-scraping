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

      let response;
      
      try{
        response = await axios(axiosOptions);
      } catch(e) {
        console.log("Get Flight Server Error");
        resolve(null);
      }

      const data = response.data;
  
      if(data.error.code) {
        console.log('Error: ' + JSON.stringify(data.error));
        resolve(null);
        return;
      }
  
      data.result.search_params.trips.map((trip) => {
        console.log(`Found ${data.result.results.length} flights | ${trip.origin} - ${trip.destination} | ${trip.preferred_time}`);
      });

      const formattedData = Array.from(await formatResults(data.result)).flat();

      resolve(formattedData);
  
    } catch (error) {
      console.log(error.message);
      resolve(null);
    }

  }, index * 3000);


}))