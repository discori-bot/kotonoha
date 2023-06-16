import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { EMBED_NEUTRAL_COLOR } from '../common/constants';
import type { Command, Execute } from '../types/command';

const description = 'Shows a list of decks';

const createDeck: Execute = async (interaction, bot) => {
  const args = {
    name: 'New Deck',
    description: 'My New Deck',
  };

  await bot.database.query(
    `INSERT INTO decks(user_id, name, description)
    VALUES ($1, $2, $3)`,
    [interaction.member?.user.id, args.name, args.description],
  );
};

const readDeck: Execute = async (interaction, bot) => {
  const embed = new EmbedBuilder().setTitle('Decks').setDescription(description);

  const res = await bot.database.query(
    `SELECT * FROM decks
    WHERE is_prebuilt
    OR user_id = $1
    ORDER BY is_prebuilt, updated_at, name`,
    [interaction.member?.user.id],
  );

  for (const { name, description: value } of res.rows) {
    embed.addFields({ name, value, inline: true });
  }

  await interaction.reply({
    embeds: [embed],
  });
};

const updateDeck: Execute = async (interaction, bot) => {
  const args = {
    name: 'Deck Name',
    newName: 'New Deck Name',
    newDescription: 'My New Deck Name',
  };

  await bot.database.query(
    `UPDATE decks
    SET name = $1,
        description = $2,
        updated_at = NOW()
    WHERE user_id = $3
    AND name = $4`,
    [args.newName, args.newDescription, interaction.member?.user.id, args.name],
  );
};

const deleteDeck: Execute = async (interaction, bot) => {
  const args = {
    name: 'Deck Name',
  };

  await bot.database.query(
    `DELETE FROM decks
    WHERE user_id = $1
    AND name = $2`,
    [interaction.member?.user.id, args.name],
  );
};

const execute: Execute = (interaction, bot) => {
  void readDeck(interaction, bot);
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
