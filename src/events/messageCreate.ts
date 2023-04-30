import { type Interaction } from 'discord.js';
import { Message } from 'discord.js';
import type BotEvent from '../types/event';
import minimist from 'minimist';

const PREFIX_LIST: Array<string> = ['[', '!'];

const processMessage = (msg: string) => {
  for (let prefix of PREFIX_LIST) {
    if (msg.startsWith(prefix)) {
      return msg.slice(prefix.length).trim();
    }
  }
}

const event: BotEvent = {
  name: 'messageCreate',
  execute: async (msg: Interaction) => {

    if (!(msg instanceof Message)) return;

    let content = processMessage(msg.content);
    if (content == undefined) return;

    const command = await msg.client.textCommandMap.get(content);
    const args = minimist(content);

    await command.execute(msg);
  },
};

export default event;
