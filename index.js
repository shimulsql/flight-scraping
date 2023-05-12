import * as dotenv from 'dotenv'
import queryBuilder from "./src/queryBuilder.mjs";
import dataInsert from "./dataInsert.js";
import { db } from './database.mjs';

dotenv.config();

(async () => {

  try {
    let queryChunks = [];
    const chunkSize = 11;
    let queries = await queryBuilder();
      
    for (let i = 0; i < queries.length; i += chunkSize) {
      queryChunks.push(queries.slice(i, i + chunkSize));
    }

    // queryChunks = [
    //   [ { from: 'DAC', to: 'RGN', date: ['2023-05-12', '2023-05-14'] } ],
    // ]
    // console.log(queryChunks); return;
    
    await Promise.all(queryChunks.map(async (query, i) => {
      var delay =  i * 1000 * 60 * 6;

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
