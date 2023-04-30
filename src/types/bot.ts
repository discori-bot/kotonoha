import { type Client, type Collection } from 'discord.js';
import type Command from './command';

type Bot = {
  client: Client;
  commands: Collection<string, Command>;
};

export default Bot;
