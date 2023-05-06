import payloadGenerator from './src/payloadGenerator.mjs';
import getSearchKey from './src/getSearchKey.mjs';
import getFlightList from './src/getFlightList.mjs';

(async () => {

  const searchPayload = payloadGenerator({
    from: 'DAC',
    to: 'CXB',
    date: '2023-05-10',
  });

  const searchKey = await getSearchKey(searchPayload);

  const flights = await getFlightList(searchKey);

  console.log(flights);


})()