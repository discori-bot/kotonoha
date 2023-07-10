import { type Client, type Collection } from 'discord.js';
import type { Command } from './command';
import type TempUserData from './tempUserData';
import type { JsonMap } from '@iarna/toml';
import type { Pool } from 'pg';

type Bot = {
  client: Client;
  commands: Collection<string, Command>;
  configs: JsonMap;
  database: Pool;
  textCommands: Collection<string, Command>;
  users: Collection<string, TempUserData>;
};

export default Bot;
