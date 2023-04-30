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

    let userData = bot.users.get(msg.author.id);
    if (commandName != '!!') {
      if (userData == undefined) {
        bot.users.set(msg.author.id, { history: [command] });
      } else if (userData['history'] == undefined) {
        userData['history'] = [command];
      } else {
        if (userData['history'].push(command) > 10) {
          userData['history'].shift();
        }
      }
    }
    const rest = stringArgv(content.slice(commandName.length));
    const args = minimist(rest);

    await command.execute({} as CommandInteraction, bot);
  },
};

export default event;
