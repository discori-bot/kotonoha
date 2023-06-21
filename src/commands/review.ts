import {
  EmbedBuilder,
  type Message,
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  type InteractionResponse,
} from 'discord.js';
import Scheduler from '../../ext/scheduler/ankiSched';
import type { Command, Execute } from '../types/command';
import type Yaritori from '../types/yaritori';

class Card extends Scheduler {
  dueDate = Date.now();

  readonly meanings;

  constructor(word: string, meanings: object) {
    super();
    this.meanings = meanings;
  }

  public answer(response: string) {
    const days = super.answer(response);
    this.dueDate = Date.now() + Card.DaysToMillis(days);
    return days;
  }
}

const description = 'Review your decks';

const mockDueDate = new Date('Tue Jun 20 2023 17:10:24 GMT+0700 (Indochina Time)');

const yomu = new Card('読む', {
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

const execute: Execute = async (interaction) => {
  const dueCards = mockCards.filter((card) => Date.now() > card.dueDate);
  if (dueCards.length === 0) {
    await interaction.reply({
      embeds: [new EmbedBuilder().setTitle('Review').setDescription('No more to review!')],
    });
    return;
  }

  const answers = { '1': 'again', '2': 'hard', '3': 'good', '4': 'easy' };

  const filter = (message: Message) =>
    Object.entries(answers).flat().includes(message.content.toLowerCase()) &&
    message.author.id === interaction.user.id;

  const collector = interaction.channel?.createMessageCollector({ filter, idle: 60000 });

  let reply: Message | InteractionResponse | undefined;
  let card: Card | undefined;

  card = dueCards.shift();
  if (card === undefined) return;

  reply = await replyOrEditCard(interaction, card, reply);

  collector?.on('collect', async (message) => {
    let answer = message.content.toLowerCase();
    if (answer in answers) {
      answer = answers[answer as keyof typeof answers];
    }
    card?.answer(answer);
    if (card?.dueDate) await interaction.reply((new Date(card.dueDate)).toString())
    
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
