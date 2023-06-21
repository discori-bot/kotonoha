import { type Message, Collection } from 'discord.js';
import minimist from 'minimist';
import stringArgv from 'string-argv';
import { PREFIX_LIST, DEFAULT_COOLDOWN_DURATION } from '../common/constants';
import Yaritori from '../types/yaritori';
import type Bot from '../types/bot';
import type { Command } from '../types/command';
import type BotEvent from '../types/event';
import type TempUserData from '../types/tempUserData';

const processMessage = (msg: string) => {
  for (const prefix of PREFIX_LIST) {
    if (msg.startsWith(prefix)) {
      return msg.slice(prefix.length).trim();
    }
  }

  return undefined;
};

const checkCooldowns = (userData: TempUserData, command: Command) => {
  const now = Date.now();
  const cooldownDuration = (command.cooldown ?? DEFAULT_COOLDOWN_DURATION) * 1000;

  const prevTimestamp = userData.cooldowns.get(command.id);
  if (prevTimestamp !== undefined) {
    const expirationTime = prevTimestamp + cooldownDuration;

    if (now < expirationTime) {
      const expiredTimestamp = Math.round(expirationTime / 1000);

      return expiredTimestamp;
    }
  }
  userData.cooldowns.set(command.id, now);
  setTimeout(() => userData?.cooldowns.delete(command.id), cooldownDuration);
  return 0;
};

const execute = async (bot: Bot, message: Message) => {
  if (message.author.bot) return;
  
  const content = processMessage(message.content);
  if (content === undefined) return;

  const parts = content.split(' ');
  if (parts.length === 0) return;

  const commandName = parts[0];
  const command = bot.textCommands.get(commandName);

  if (command === undefined) return;

  let userData = bot.users.get(message.author.id);

  if (userData === undefined) {
    userData = {
      history: [],
      cooldowns: new Collection<string, number>(),
    };
    bot.users.set(message.author.id, userData);
  }

  if (commandName !== '!!') {
    if (userData.history.push(command) > 10) {
      userData.history.shift();
    }
  }

  const cooldown = checkCooldowns(userData, command);
  if (cooldown > 0) {
    await message.reply({
      content: `You are on cooldown for this command. You can use it again in <t:${cooldown}:R>.`,
    });
    return;
  }

  const rest = stringArgv(content.slice(commandName.length));
  const args = minimist(rest);

  await command.execute(new Yaritori(message), bot);
};

const event: BotEvent = {
  name: 'messageCreate',
  execute,
};

export default event;
