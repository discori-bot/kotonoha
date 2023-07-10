import { type Message } from 'discord.js';
import dispatchCommand from '../utils/commandDispatcher';
import type Bot from '../types/bot';
import type BotEvent from '../types/event';

const event: BotEvent = {
  name: 'messageCreate',
  execute: async (bot: Bot, message: Message) => {
    await dispatchCommand(bot, message);
  },
};

export default event;
