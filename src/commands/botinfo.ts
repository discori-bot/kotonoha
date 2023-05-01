import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { EMBED_NEUTRAL_COLOR } from '../common/constants';
import type Command from '../types/command';

const description = "Shows the bot's status";

const command: Command = {
  id: 'botinfo',
  command: new SlashCommandBuilder().setName('status').setDescription(description),
  cmdNames: ['botinfo'],
  description,
  help: new EmbedBuilder()
    .setColor(EMBED_NEUTRAL_COLOR)
    .setTitle('Bot Status')
    .setDescription(description),

  execute: async (interaction) => {
    const reply = await interaction.reply({
      embeds: [new EmbedBuilder().setColor(EMBED_NEUTRAL_COLOR).setTitle('Pong!')],
    });

    const { uptime } = interaction.client;
    const days = Math.floor(uptime / 86400000);
    const hours = Math.floor(uptime / 3600000) % 24;
    const minutes = Math.floor(uptime / 60000) % 60;
    const seconds = Math.floor(uptime / 1000) % 60;

    const embed = new EmbedBuilder()
      .setColor(EMBED_NEUTRAL_COLOR)
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
    await interaction.editReply({ embeds: [embed] });
  },
};

export default command;
