import { type Client, type Collection } from 'discord.js';
import type Command from './command';

type Bot = {
  client: Client;
  commands: Collection<string, Command>;
  textCommands: Collection<string, Command>;
  users: Collection<string, { history: Command[] }>;
};

export default Bot;
