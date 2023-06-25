import { readFileSync } from 'node:fs';
import { parse } from '@iarna/toml';

const loadConfigs = () => {
  const source = readFileSync('config.toml', 'utf-8');
  return parse(source);
};

export default loadConfigs;
