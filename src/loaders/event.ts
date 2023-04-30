import { readdirSync } from 'fs';
import path from 'path';
import type BotEvent from '../types/event';

const loadEvents = (onLoad: (event: BotEvent) => void) => {
  const eventsDir = path.join(__dirname, '../events');

  readdirSync(eventsDir).forEach((file) => {
    if (!file.endsWith('.js')) return;

    const filePath = path.join(eventsDir, file);
    const event = (require(filePath) as { default: BotEvent }).default;

    onLoad(event);
  });
};

export default loadEvents;
