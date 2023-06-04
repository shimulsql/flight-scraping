import fs from 'fs/promises'
import path from 'path';
import { fileURLToPath } from 'url';

const moduleURL = import.meta.url;
const modulePath = fileURLToPath(moduleURL);
const __dirname = path.dirname(modulePath);

const filePath = path.join(__dirname, '../../', 'date.txt');

export default (date) => (new Promise(async resolve => {
  try {
    const content = new String(date);
    await fs.writeFile(filePath, content);
    console.log("Date increased: " + date);
  } catch (error) {
    console.log(error.message);
  } finally {
    resolve();
  }
}))

export const getIncreaseDate = () => (new Promise(async resolve => {
  try {
    const data = await fs.readFile(filePath, {encoding: 'utf-8'});

    resolve(data);
  } catch (error) {
    console.log(error);
  }
}))