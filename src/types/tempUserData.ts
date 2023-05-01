import { Collection } from 'discord.js';
import type Command from './command';

type TempUserData = {
  history: Command[];
  cooldowns: Collection<string, number>;
};

export default TempUserData;
