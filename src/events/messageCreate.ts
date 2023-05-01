import { type Message, type CommandInteraction, Collection } from 'discord.js';
import minimist from 'minimist';
import stringArgv from 'string-argv';
import type Bot from '../types/bot';
import type BotEvent from '../types/event';

const PREFIX_LIST: Array<string> = ['[', '!'];
const DEFAULT_COOLDOWN_DURATION = 1;

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

    var userData = bot.users.get(msg.author.id);

    if (userData == undefined) {
      userData = {
        history: [command],
        cooldowns: new Collection<string, number>(),
      };
      bot.users.set(msg.author.id, userData);
    }

    if (commandName != '!!') {
      if (userData['history'].push(command) > 10) {
        userData['history'].shift();
      }
    }

    const now = Date.now();
    const cooldownDuration = (command.cooldown ?? DEFAULT_COOLDOWN_DURATION) * 1000;

    const prevTimestamp = userData.cooldowns.get(command.id);
    if (prevTimestamp != undefined) {
      const expirationTime = prevTimestamp + cooldownDuration;

      if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1000);

        await msg.reply({
          content: `You are on cooldown for this command. You can use it again in <t:${expiredTimestamp}:R>.`,
        });

        return;
      }
    }
    userData.cooldowns.set(command.id, now);
    setTimeout(() => userData?.cooldowns.delete(command.id), cooldownDuration);

    const rest = stringArgv(content.slice(commandName.length));
    const args = minimist(rest);

    await command.execute({} as CommandInteraction, bot);
  },
};

export default event;
