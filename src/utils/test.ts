import assert from 'assert';
import loadDictionary from './loadDictionary';
import type Entry from '../types/entry';
/*
34838,家,いえ,n,,999800,"house,residence,dwelling",1191730,⭐ ichi
34839,家,いえ,n,,999799,"family,household",1191730,⭐ ichi
34840,家,いえ,n,,999798,"lineage,family name",1191730,⭐ ichi
34841,家,うち,n uk,,999800,house,1191740,⭐ ichi
34842,家,うち,n uk,,999799,"one's house,one's home,one's family,one's household",1191740,⭐ ichi
34843,家,け,suf,,999800,"house,family",1191750,⭐ ichi
*/

// console.log(JMDICT.get('家'));

async function test() {
  const JMDICT = await loadDictionary('private/Dictionaries/[JP-EN] JMDICT EN.csv');

  const 読む = JMDICT.get('読む');
  const よむ = JMDICT.get('よむ');

  const test読む: Entry = {
    term: '読む',
    reading: 'よむ',
    tags: 'v5m vt',
    deinflectors: 'v5',
    popularity: '1999800',
    definition: 'to read',
    sequence: '1456360',
    bigTags: '⭐ ichi news6k',
  };
  
  const testよむ: Entry = {
    term: '詠む',
    reading: 'よむ',
    tags: 'v5m vt',
    deinflectors: 'v5',
    popularity: '1999800',
    definition: 'to compose (a Japanese poem),to write,to use as the theme of a poem',
    sequence: '1174820',
    bigTags: '⭐ ichi news18k',
  };

  if (読む) assert.deepEqual(読む[0], test読む);
  if (よむ) assert.deepEqual(よむ[0], testよむ);
}

void test();
