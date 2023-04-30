import { type GatewayDispatchEvents } from 'discord.js';
import type Bot from './bot';

type EventHandler = {
  events: GatewayDispatchEvents[];
  /**
   * しょうがない…
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: (bot: Bot, ...args: any[]) => void | Promise<void>;
  once?: boolean;
};

export default EventHandler;
