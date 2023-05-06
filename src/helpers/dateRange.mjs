export default (start, end) => {
  const dateArray = [];
  let currentDate = new Date(start);

  const addLeadingZero = (number) => {
    return number < 10 ? '0' + number : number;
  };

  while (currentDate <= new Date(end)) {
    const formattedDate = `${currentDate.getFullYear()}-${addLeadingZero(currentDate.getMonth() + 1)}-${addLeadingZero(currentDate.getDate())}`;
    dateArray.push(formattedDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
}