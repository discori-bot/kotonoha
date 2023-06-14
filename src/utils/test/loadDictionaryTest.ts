import assert from 'assert';
import loadDictionary from '../loadDictionary';
import type Entry from '../../types/entry';

async function test() {

  const JMDICT = await loadDictionary('private/Dictionaries/[JP-EN] JMDICT EN.csv');

  // Tests for correct entries
  const 読む = JMDICT.get('読む');
  const よむ = JMDICT.get('よむ');

  const test読む: Entry = {
    term: '読む',
    reading: 'よむ',
    tags: 'v5m vt',
    deinflectors: 'v5',
    definition: 'to read',
    bigTags: '⭐ ichi news6k',
    link: null,
  };
  
  const testよむ: Entry = {
    term: '詠む',
    reading: 'よむ',
    tags: 'v5m vt',
    deinflectors: 'v5',
    definition: 'to compose (a Japanese poem),to write,to use as the theme of a poem',
    bigTags: '⭐ ichi news18k',
    link: null,
  };

  if (読む) assert.deepStrictEqual(読む[0], test読む, 'Query result is inconsistent to data');
  if (よむ) assert.deepStrictEqual(よむ[0], testよむ, 'Query result is inconsistent to data');

  // Tests for working links
  const 引き起こす = JMDICT.get('引き起こす');
  let 引きおこす = JMDICT.get('引きおこす');

  if (引きおこす && 引きおこす[0].link) 
    引きおこす = JMDICT.get(引きおこす[0].link);

  assert.deepStrictEqual(引き起こす, 引きおこす, 'Linked entry retursn different results to original entry');

}

void test();


