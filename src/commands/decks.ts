import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { EMBED_NEUTRAL_COLOR } from '../common/constants';
import type { Command, Execute } from '../types/command';

const description = 'Shows a list of decks';

const execute: Execute = async (interaction, bot) => {
  const res = await bot.database.query('SELECT $1::text as message', ['Database queried!']);
  console.log(res.rows[0]);

  await interaction.reply({
    embeds: [new EmbedBuilder().setTitle('Decks').setDescription(description)],
  });
};

const command: Command = {
  id: 'decks',
  command: new SlashCommandBuilder().setName('decks').setDescription(description),
  cmdNames: ['decks'],
  description,
  help: new EmbedBuilder()
    .setColor(EMBED_NEUTRAL_COLOR)
    .setTitle('Decks')
    .setDescription(description),

  execute,
};

export default command;
