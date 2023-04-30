import { type Collection } from 'discord.js';
import type Command from './command';

declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, Command>;
    textCommandMap: Collection<string, Command>;
  }
}
