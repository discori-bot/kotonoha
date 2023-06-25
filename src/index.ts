import { Client, Collection, GatewayIntentBits, REST, Routes, type ClientEvents } from 'discord.js';
import loadCommands from './loaders/command';
import loadConfigs from './loaders/config';
import loadEvents from './loaders/event';
import { type BotEventNames } from './types/event';
import requireConfig from './utils/requireConfig';
import type Bot from './types/bot';
import type { Command } from './types/command';
import type TempUserData from './types/tempUserData';

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
    configs: loadConfigs(),
    textCommands: new Collection<string, Command>(),
    users: new Collection<string, TempUserData>(),
  };

  const botToken = requireConfig(bot, 'botToken') as string;
  const rest = new REST().setToken(botToken);

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

  const clientID = requireConfig(bot, 'clientID') as string;
  await rest.put(Routes.applicationCommands(clientID), {
    body: bot.commands.map((command) => command.command.toJSON()),
  });

  return bot.client.login(botToken);
};

void start();
