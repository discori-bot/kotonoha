import { readdirSync } from 'fs';
import path from 'path';
import type EventHandler from '../types/event';

const loadEvents = (onLoad: (event: EventHandler) => void) => {
  const eventsDir = path.join(__dirname, '../events');

  readdirSync(eventsDir).forEach((file) => {
    if (!file.endsWith('.js')) return;

    const filePath = path.join(eventsDir, file);
    const event = (require(filePath) as { default: EventHandler }).default;

    onLoad(event);
  });
};

export default loadEvents;
