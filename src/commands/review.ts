import {
  EmbedBuilder,
  type Message,
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  type InteractionResponse,
} from 'discord.js';
import Scheduler from '../../ext/scheduler/ankiSched';
import type { Command, Execute } from '../types/command';
import type Card from '../types/card';
import type Yaritori from '../types/yaritori';

class AnkiCard extends Scheduler implements Card {
  public word: string;

  readonly meanings;

  constructor(word: string, meanings: object) {
    super();

    this.word = word;
    this.meanings = meanings;
  }
}

const description = 'Review your decks';

const mockDueDate = new Date('Tue Jun 20 2023 17:10:24 GMT+0700 (Indochina Time)');

const yomu: Card = new AnkiCard('読む', {
  三省堂: `カシュー（名）〔cashew〕
①〘植〙西インド諸島などにはえる、ウルシに似た木。
②「カシュー①」の実から作る合成塗料(トリョウ)。`,
  JMDICT: `cashew (Anacardium occidentale)
  acajou`,
});
yomu.dueDate = mockDueDate.getTime();
const mockCards = [yomu, yomu, yomu, yomu, yomu];

const replyOrEditCard = async <T extends Message | ChatInputCommandInteraction>(
  interaction: Yaritori<T>,
  card: Card,
  replyMessage?: Message | InteractionResponse,
) => {
  const embed = new EmbedBuilder().setTitle('Review');
  for (const [dictionary, meaning] of Object.entries(card.meanings)) {
    embed.addFields({ name: dictionary, value: meaning as string });
  }

  if (!replyMessage) return interaction.reply({ embeds: [embed] });
  if (interaction.isSlashCommand()) return interaction.editReply({ embeds: [embed] });
  return replyMessage.edit({ embeds: [embed] });
};

const handleResponse = async <T extends Message | ChatInputCommandInteraction>(
  interaction: Yaritori<T>,
  card: Card,
  response: string,
  answersMap: Map<string, string>,
) => {
  if (response === 'bury') {
    card?.toggleBury();
    // Reply with the formatted dueDate for testing
    if (card?.dueDate) await interaction.reply(new Date(card.dueDate).toString());
    return;
  }

  if (response === 'suspend') {
    card?.toggleSuspend();
    // Reply with the formatted dueDate for testing
    if (card?.dueDate) await interaction.reply(new Date(card.dueDate).toString());
    return;
  }

  if (response === 'mark') {
    card?.toggleMark();
    // Reply with the formatted dueDate for testing
    if (card?.dueDate) await interaction.reply(new Date(card.dueDate).toString());
    return;
  }

  let answer = response;
  // Map the numbers 1, 2, 3, 4 to the responses 'again', 'hard', 'good', 'easy'
  if (answersMap.has(answer)) {
    answer = answersMap.get(answer) ?? '';
  }

  card?.answer(answer);
  // Reply with the formatted dueDate for testing
  if (card?.dueDate) await interaction.reply(new Date(card.dueDate).toString());
};

const execute: Execute = async (interaction) => {
  const dueCards = mockCards.filter((card) => Date.now() > card.dueDate && !card.suspended);
  if (dueCards.length === 0) {
    await interaction.reply({
      embeds: [new EmbedBuilder().setTitle('Review').setDescription('No more to review!')],
    });
    return;
  }

  const answersMap = new Map([
    ['1', 'again'],
    ['2', 'hard'],
    ['3', 'good'],
    ['4', 'easy'],
  ]);

  const filter = (message: Message) =>
    ['bury', 'mark', 'suspend', ...Array.from(answersMap.entries()).flat()].includes(
      message.content.toLowerCase(),
    ) && message.author.id === interaction.user.id;

  const collector = interaction.channel?.createMessageCollector({ filter, idle: 60000 });

  let reply: Message | InteractionResponse | undefined;
  let card: Card | undefined;

  card = dueCards.shift();
  if (card === undefined) return;

  reply = await replyOrEditCard(interaction, card, reply);

  collector?.on('collect', async (message) => {
    const response = message.content.toLowerCase();

    if (card === undefined) return;
    await handleResponse(interaction, card, response, answersMap);

    card = dueCards.shift();
    if (card === undefined) return;
    reply = await replyOrEditCard(interaction, card, reply);
  });
};

const command: Command = {
  id: 'review',
  command: new SlashCommandBuilder().setName('review').setDescription(description),
  cmdNames: ['review', 'r'],
  description,
  help: new EmbedBuilder().setTitle('review').setDescription(description),
  execute,
};

export default command;
