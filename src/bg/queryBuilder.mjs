import dateRangeArray from './../helpers/dateRange.mjs'

export default (routes) => {
  let payloads = [];
  

  routes.forEach(route => {
    payloads.push({
      from: route.from,
      to: route.to, 
      date: route.date
   }); 
  });

  return payloads.flat();

}