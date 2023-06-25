import { type Client, type Collection } from 'discord.js';
import type { Command } from './command';
import type TempUserData from './tempUserData';
import type { JsonMap } from '@iarna/toml';

type Bot = {
  client: Client;
  commands: Collection<string, Command>;
  configs: JsonMap;
  textCommands: Collection<string, Command>;
  users: Collection<string, TempUserData>;
};

export default Bot;
