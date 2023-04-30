import { GatewayDispatchEvents } from 'discord.js';
import type EventHandler from '../types/event';

const handler: EventHandler = {
  events: [GatewayDispatchEvents.Ready],
  once: true,
  execute: () => {
    console.log('[*] bot ready!');
  },
};

export default handler;
