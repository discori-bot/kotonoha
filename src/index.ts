import { Client, Collection, GatewayIntentBits, REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import loadCommands from './loaders/command';
import loadEvents from './loaders/event';
import getRequiredEnv from './utils/getRequiredEnv';
import type Command from './types/command';

dotenv.config();

const start = async () => {
  const token = getRequiredEnv('TOKEN');

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ]
  });
  const rest = new REST().setToken(token);

  client.commands = new Collection<string, Command>();
  client.textCommandMap = new Collection<string, Command>();

  loadCommands((command) => {
    client.commands.set(command.command.name, command);
    for (let name of command.cmdNames) {
      client.textCommandMap.set(name, command);
    };
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
