export default (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function delayStatus(delayTime) {
  if(delayTime >= 1000 * 60) {
    console.log('delayed: ' + delayTime / (60 * 1000) + ' minutes');
  } else if(delayTime > 1000) {
    console.log('delayed: ' + delayTime / 1000 + ' seconds');
  } else if(delayTime > 0) {
    console.log('delayed: ' + delayTime + ' ms');
  }
}