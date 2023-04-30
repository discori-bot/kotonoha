import { Client, Collection, REST, Routes, type ClientEvents } from 'discord.js';
import dotenv from 'dotenv';
import loadCommands from './loaders/command';
import loadEvents from './loaders/event';
import { type BotEventNames } from './types/event';
import getRequiredEnv from './utils/getRequiredEnv';
import type Bot from './types/bot';
import type Command from './types/command';

dotenv.config();

const start = async () => {
  const bot: Bot = {
    client: new Client({ intents: [] }),
    commands: new Collection<string, Command>(),
  };

  const token = getRequiredEnv('TOKEN');
  const rest = new REST().setToken(token);

  loadCommands((command) => {
    bot.commands.set(command.command.name, command);
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
