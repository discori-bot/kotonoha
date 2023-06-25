import { readdirSync } from 'fs';
import path from 'path';
import { EmbedBuilder } from 'discord.js';
import type { Command } from '../types/command';

const commands: Command[] = [];
const commandsDir = path.join(__dirname, '../commands');
readdirSync(commandsDir).forEach((file) => {
  if (!file.endsWith('.js')) return;
  if (file.endsWith('help.js')) return;

  const filePath = path.join(commandsDir, file);
  const command = (require(filePath) as { default: Command }).default;
  commands.push(command);
});

const embed = new EmbedBuilder()
  .setAuthor({ name: 'Discori', iconURL: 'https://i.postimg.cc/D0QcwWjv/Discori.png' })
  .setDescription('My commands:');
for (const command of commands) {
  embed.addFields({
    name: command.id,
    value: command.description,
  });
}

export default embed;
