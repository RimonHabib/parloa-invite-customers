import { createReadStream, existsSync } from 'fs';
import * as readline from 'node:readline';

export type Customer = {
  id: string;
  lat: number;
  long: number;
};

export default class CustomerDataPerser {
  /**
   * Parses from text file
   * @param line
   * @returns Customer
   */
  private fromText(line: string): Customer {
    const dataChunks = line.split(',');
    const [idString, latString, longString] = dataChunks;
    const id = idString.split(':').pop().trim();
    const lat = Number(latString.split(':').pop().trim());
    const long = Number(longString.split(':').pop().trim());

    return {
      id: id,
      lat: lat,
      long: long,
    };
  }

  /**
   * Parse data and pass to a callback
   * @param filePath
   * @param callback
   */
  public async parse(filePath: string, callback: Function) {
    if (!existsSync(filePath)) {
      throw new Error(`Can not locate ${filePath}, Please check if the file exists`);
    }

    const rl = readline.createInterface({
      input: createReadStream(filePath),
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      // Construct customer object for every non-empty line and passes to the callback
      if (line.trim().length > 1) callback(this.fromText(line));
    }
  }
}

