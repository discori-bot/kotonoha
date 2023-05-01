import { type Client, type Collection } from 'discord.js';
import type Command from './command';
import type TempUserData from './tempUserData';

type Bot = {
  client: Client;
  commands: Collection<string, Command>;
  textCommands: Collection<string, Command>;
  users: Collection<string, TempUserData>;
};

export default Bot;
