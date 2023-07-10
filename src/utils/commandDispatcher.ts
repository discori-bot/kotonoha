import { type JsonMap } from '@iarna/toml';
import { type Message, Collection, ChatInputCommandInteraction } from 'discord.js';
import minimist from 'minimist';
import stringArgv from 'string-argv';
import Yaritori from '../types/yaritori';
import type Bot from '../types/bot';
import type { Command } from '../types/command';
import type TempUserData from '../types/tempUserData';

const getCommandAndArgs = (
  bot: Bot,
  interaction: Message | ChatInputCommandInteraction,
  prefixes: string[],
) => {
  if (interaction instanceof ChatInputCommandInteraction) {
    return { command: bot.commands.get(interaction.commandName), args: undefined };
  }

  for (const prefix of prefixes) {
    if (interaction.content.startsWith(prefix)) {
      const [commandName, ...args] = stringArgv(interaction.content.slice(prefix.length));
      const command = bot.textCommands.get(commandName);
      if (command) return { command, args: minimist(args) };
    }
  }

  return { command: undefined, args: undefined };
};

const onCooldown = <T extends ChatInputCommandInteraction | Message>(
  yaritori: Yaritori<T>,
  userData: TempUserData,
  command: Command,
  defaultCooldown: number,
) => {
  const cooldownDuration = command.cooldown ?? defaultCooldown;
  const prevTimestamp = userData.cooldowns.get(command.id);

  if (prevTimestamp !== undefined) {
    const cooldown = Math.round((prevTimestamp + cooldownDuration) / 1000);
    void yaritori.reply({
      content: `You are on cooldown for this command. You can use it again in <t:${cooldown}:R>.`,
      ephemeral: true,
    });
    return true;
  }

  userData.cooldowns.set(command.id, Date.now());
  setTimeout(() => userData.cooldowns.delete(command.id), cooldownDuration);
  return false;
};

const dispatchCommand = async (bot: Bot, interaction: Message | ChatInputCommandInteraction) => {
  const yaritori = new Yaritori(interaction);
  const { commandCooldown, historySize, prefixes } = bot.configs.server as JsonMap;

  if (yaritori.user.bot) return;

  const { command, args } = getCommandAndArgs(bot, interaction, prefixes as string[]);
  if (command === undefined) return;

  const userData = bot.users.ensure(yaritori.user.id, () => ({
    history: [],
    cooldowns: new Collection<string, number>(),
  }));

  if (command.id !== 'repeat') {
    if (userData.history.push(command) > (historySize as number)) {
      userData.history.shift();
    }
  }

  if (onCooldown(yaritori, userData, command, commandCooldown as number)) return;

  await command.execute(yaritori, bot);
};

export default dispatchCommand;
