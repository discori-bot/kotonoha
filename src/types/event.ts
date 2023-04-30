import { type Awaitable, type ClientEvents } from 'discord.js';
import type Bot from './bot';

export type BotEventNames = keyof ClientEvents;

type BotEventGeneric<T extends BotEventNames> = {
  execute: (bot: Bot, ...args: ClientEvents[T]) => Awaitable<void>;
  name: T;
  once?: boolean;
};

/**
 * Union type of all possible values of `BotEventGeneric`
 * so that it's possible to initialize a value of it
 * without manually specifying the type argument `T` (will be inferred from property values).
 */
type BotEvent = { [K in BotEventNames]: BotEventGeneric<K> }[BotEventNames];

export default BotEvent;
