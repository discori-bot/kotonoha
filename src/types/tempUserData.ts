import { type Collection } from 'discord.js';
import type { Command } from './command';

type TempUserData = {
  cooldowns: Collection<string, number>;
  history: Command[];
};

export default TempUserData;
