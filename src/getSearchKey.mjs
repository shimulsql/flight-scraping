import axios from "axios"

export default (payload, index) => (new Promise(async (resolve, reject) => {

  const url = "https://production.gozayaan.com/api/flight/v2.0/search/";

  try {

    const axiosOptions = {
      method: "post",
      url: url,
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
      json: true,
    };

    setTimeout( async () => {

      const response = await axios(axiosOptions);
      const data = response.data;
  
  
      if(data.error.code == 400) {
        console.log('Error: ' + JSON.stringify(data.error));
        
        resolve(null);
      } else {
        console.log(`Found search key: ${data?.result?.id} | ${data.result.search_params.trips[0].origin} - ${data.result.search_params.trips[0].destination} | ${data.result.search_params.trips[0].preferred_time}`);
  
        resolve(data?.result?.id);
      }

    }, index * 2000);

  } catch (error) { 
    console.log(error.message);
   }


}))

