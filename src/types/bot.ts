import { Client, Collection } from 'discord.js';
import type Command from './command';

class Bot extends Client {
  public commands: Collection<string, Command> = new Collection<string, Command>();
}

export default Bot;
