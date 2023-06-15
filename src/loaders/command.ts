import { readdirSync } from 'fs';
import path from 'path';
import type { Command } from '../types/command';

const loadCommands = (onLoad: (command: Command) => void) => {
  const commandsDir = path.join(__dirname, '../commands');

  readdirSync(commandsDir).forEach((file) => {
    if (!file.endsWith('.js')) return;

    const filePath = path.join(commandsDir, file);
    const command = (require(filePath) as { default: Command }).default;
    onLoad(command);
  });
};

export default loadCommands;
