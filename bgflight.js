import queryBuilder from "./src/bg/queryBuilder.mjs";
import routesBuilder from "./src/bg/routesBuilder.mjs"
import processQueries from "./src/bg/processQueries.mjs";
import { db } from "./database.mjs";

(async () => {

  const config = {
    dateFromStart: 0,
    dateIncrease: 5,
    waitChunkMinute: 3,
    waitServerRequestSecond: 2,
    chunkSize: 8,
  }
  const routes = routesBuilder(config);
  const queries = queryBuilder(routes);
  let queryChunks = [];
   
  for (let i = 0; i < queries.length; i += config.chunkSize) {
    queryChunks.push(queries.slice(i, i + config.chunkSize));
  }

  // console.log(queryChunks);return;

  try {
    let process = await Promise.all(queryChunks.map(async (queries, i) => {
      var delay =  i * 1000 * 60 * config.waitChunkMinute;
      if(i == 0) delay = 0;

      return await processQueries(queries, delay, config)
    }))

    console.log('Success!');
    console.log(`\n \nTotal rows inserted: ${process.reduce((a, b) => a + b, 0)}`);
  } catch (error) {
    console.log(error.message);
  } finally{
    db.destroy();
  }

})()



