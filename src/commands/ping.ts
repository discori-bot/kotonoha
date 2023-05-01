import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { EMBED_NEUTRAL_COLOR } from '../common/constants';
import type Command from '../types/command';

const description = "Shows the bot's ping";

const command: Command = {
  id: 'ping',
  command: new SlashCommandBuilder().setName('ping').setDescription(description),
  cmdNames: ['ping'],
  description,
  help: new EmbedBuilder()
    .setColor(EMBED_NEUTRAL_COLOR)
    .setTitle('Ping')
    .setDescription(description),

  execute: async (interaction) => {
    const reply = await interaction.reply({
      embeds: [new EmbedBuilder().setColor(EMBED_NEUTRAL_COLOR).setTitle('Pong!')],
    });
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
      );
    await interaction.editReply({ embeds: [embed] });
  },
};

export default command;
