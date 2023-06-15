import { Client, Collection, GatewayIntentBits, REST, Routes, type ClientEvents } from 'discord.js';
import dotenv from 'dotenv';
import loadCommands from './loaders/command';
import loadEvents from './loaders/event';
import { type BotEventNames } from './types/event';
import getRequiredEnv from './utils/getRequiredEnv';
import type Bot from './types/bot';
import type { Command } from './types/command';
import type TempUserData from './types/tempUserData';

dotenv.config();

const start = async () => {
  const bot: Bot = {
    client: new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    }),
    commands: new Collection<string, Command>(),
    textCommands: new Collection<string, Command>(),
    users: new Collection<string, TempUserData>(),
  };

  const token = getRequiredEnv('TOKEN');
  const rest = new REST().setToken(token);

  loadCommands((command) => {
    bot.commands.set(command.command.name, command);
    for (const name of command.cmdNames) {
      bot.textCommands.set(name, command);
    }
  });

  loadEvents((event) => {
    const handler = <T extends BotEventNames>(...args: ClientEvents[T]) =>
      // @ts-expect-error - will generate a union type that's too big for TypeScript to represent.
      event.execute(bot, ...args);

    if (event.once) {
      bot.client.once(event.name, handler);
    } else {
      bot.client.on(event.name, handler);
    }
  });

  await rest.put(Routes.applicationCommands(getRequiredEnv('CLIENT_ID')), {
    body: bot.commands.map((command) => command.command.toJSON()),
  });

  return bot.client.login(token);
};

void start();
