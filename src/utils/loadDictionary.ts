import * as fs from 'fs';
import * as readline from 'readline';
import type Dictionary from '../types/dictionary';
import type Entry from '../types/entry';

const loadDictionary = async (path: string) => {
  const start = Date.now();
  let count = 0;

  const dictionary: Dictionary = new Map();
  const stream = fs.createReadStream(path);
  const rl = readline.createInterface({ input: stream });

  for await (const row of rl) {
    const [term, reading, tags, deinflectors, definition, bigTags, link] =
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      row.match(/"([^"]*)"|([^,]+)|(?<=,|^)(?=,|$)/g)!;

    const thisEntry: Entry = {
      term,
      reading,
      tags: tags || null,
      deinflectors: deinflectors || null,
      definition: (definition.startsWith('"') && definition.endsWith('"')) ? definition.slice(1, definition.length-1) : definition || null,
      bigTags: bigTags || null,
      link: link || null,
    };

    if (!dictionary.has(term)) {
      dictionary.set(term, []);
    }
    dictionary.get(term)?.push(thisEntry);

    if (!dictionary.has(reading)) {
      dictionary.set(reading, []);
    }
    dictionary.get(reading)?.push(thisEntry);
    
    count += 1;
  }

  const end = Date.now();
  const time = (end - start) / 1000;
  console.log(`Read ${count} entries in ${time} seconds`);
  return dictionary;
};

export default loadDictionary;
