import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import loadCommands from './loaders/command';
import loadEvents from './loaders/events';
import Bot from './types/bot';
import getRequiredEnv from './utils/getRequiredEnv';

dotenv.config();

const start = async () => {
  const token = getRequiredEnv('TOKEN');

  const client = new Bot({ intents: [] });
  const rest = new REST().setToken(token);

  loadCommands((command) => {
    client.commands.set(command.command.name, command);
  });

  loadEvents((event) => {
    /**
     * Fool TypeScript :)
     */
    const handler = (...args: unknown[]) => event.execute(...args);

    if (event.once) {
      client.once(event.name, handler);
    } else {
      client.on(event.name, handler);
    }
  });

  await rest.put(Routes.applicationCommands(getRequiredEnv('CLIENT_ID')), {
    body: client.commands.map((command) => command.command.toJSON()),
  });

  return client.login(token);
};

void start();
