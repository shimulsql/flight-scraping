import fs from 'fs/promises'
import path from 'path';

const __dirname = path.resolve();
const fileUrl = path.join(__dirname, 'date.txt');

export default (date) => (new Promise(async resolve => {
  try {
    const content = new String(date);
    await fs.writeFile(fileUrl, content);
    console.log("Date increased: " + date);
  } catch (error) {
    console.log(error.message);
  } finally {
    resolve();
  }
}))

export const getIncreaseDate = () => (new Promise(async resolve => {
  try {
    const data = await fs.readFile(fileUrl, {encoding: 'utf-8'});

    resolve(data);
  } catch (error) {
    console.log(error);
  }
}))