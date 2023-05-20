import * as dotenv from 'dotenv'
import queryBuilder from "./src/queryBuilder.mjs";
import dataInsert from "./dataInsert.js";
import { db } from './database.mjs';

dotenv.config();

(async () => {

  try {
    const chunkSize = 7;
    const waitTimeMinute = 10;
    let queryChunks = [];
    let queries = await queryBuilder();
      
    for (let i = 0; i < queries.length; i += chunkSize) {
      queryChunks.push(queries.slice(i, i + chunkSize));
    }

    // queryChunks = [
    //   [ { from: 'DAC', to: 'JED', date: ['2023-06-14', '2023-06-15'] } ],
    // ]

    // console.log(queryChunks); return;
    
    await Promise.all(queryChunks.map(async (query, i) => {
      var delay =  i * 1000 * 60 * waitTimeMinute;

      if(i == 0) {
        delay = 0;
      }

      await dataInsert(query, delay);
    }))

    console.log('Finish');

  } catch (error) {

    console.log(error.message);

  } finally {

    db.destroy();

  }



})()
