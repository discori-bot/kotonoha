import { type Message, type CommandInteraction } from 'discord.js';
import minimist from 'minimist';
import stringArgv from 'string-argv';
import type Bot from '../types/bot';
import type BotEvent from '../types/event';

const PREFIX_LIST: Array<string> = ['[', '!'];

const processMessage = (msg: string) => {
  for (const prefix of PREFIX_LIST) {
    if (msg.startsWith(prefix)) {
      return msg.slice(prefix.length).trim();
    }
  }

  return undefined;
};

const event: BotEvent = {
  name: 'messageCreate',
  execute: async (bot: Bot, msg: Message) => {
    const content = processMessage(msg.content);
    if (content === undefined) return;

    const parts = content.split(' ');
    if (parts.length === 0) return;

    const commandName = parts[0];
    const command = bot.textCommands.get(commandName);

    if (command === undefined) return;

    const rest = stringArgv(content.slice(commandName.length));
    const args = minimist(rest);

    await command.execute({} as CommandInteraction);
  },
};

export default event;
