import { type JsonMap } from '@iarna/toml';
import { type ColorResolvable, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import type { Command, Execute } from '../types/command';

const description = "Shows the bot's status";

const execute: Execute = async (interaction, bot) => {
  const reply = await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor((bot.configs.color as JsonMap).embedColor as ColorResolvable)
        .setTitle('Pong!'),
    ],
  });

  const { uptime } = interaction.client;

  if (uptime === null) return;

  const days = Math.floor(uptime / 86400000);
  const hours = Math.floor(uptime / 3600000) % 24;
  const minutes = Math.floor(uptime / 60000) % 60;
  const seconds = Math.floor(uptime / 1000) % 60;

  const embed = new EmbedBuilder()
    .setColor((bot.configs.color as JsonMap).embedColor as ColorResolvable)
    .setTitle('Pong!')
    .addFields(
      {
        name: 'Latency',
        value: `${reply.createdTimestamp - interaction.createdTimestamp}ms`,
        inline: true,
      },
      {
        name: 'API',
        value: `${interaction.client.ws.ping}ms`,
        inline: true,
      },
      {
        name: 'Uptime',
        value: `${days}d ${hours}h ${minutes}m ${seconds}s`,
        inline: true,
      },
    );
  await reply.edit({ embeds: [embed] });
};

const command: Command = {
  id: 'botinfo',
  command: new SlashCommandBuilder().setName('status').setDescription(description),
  cmdNames: ['botinfo'],
  description,
  help: new EmbedBuilder().setTitle('Bot Status').setDescription(description),
  execute,
};

export default command;
