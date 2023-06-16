import {
  type User,
  type Message,
  type GuildMember,
  type APIInteractionGuildMember,
  type TextBasedChannel,
  type Snowflake,
  type Guild,
  Locale,
  ChatInputCommandInteraction,
  type BaseMessageOptions,
  MessageFlags,
  type InteractionDeferReplyOptions,
  type Client,
} from 'discord.js';

const DEFAULT_LOCALE = Locale.EnglishUS;

export type ReplyOptions = BaseMessageOptions & {
  ephemeral?: boolean;
  tts?: boolean;
};

/**
 * Wrapper class for a 遣り取り started from the execution of a command.
 * Standardizes the differences between execution via slash and text commands,
 * and allows commands to respond to the user in either case without
 * worrying about the specifics.
 */
class Yaritori<T extends ChatInputCommandInteraction | Message> {
  constructor(private interaction: T) {}

  /**
   * Returns true if this Yaritori is a message command.
   */
  public isMessageCommand() {
    if (this.interaction instanceof ChatInputCommandInteraction) return false;
    return true;
  }

  /**
   * Returns true if this Yaritori is a slash command.
   */
  public isSlashCommand() {
    return !this.isMessageCommand();
  }

  /**
   * The ID of the underlying interaction/message.
   */
  public get id(): Snowflake {
    return this.interaction.id;
  }

  /**
   * The user who started this Yaritori.
   */
  public get user(): User {
    return this.if({
      slashCommand: (interaction) => interaction.user,
      textCommand: (message) => message.author,
    });
  }

  /**
   * The member which started this Yaritori, if it was done in a guild.
   * If the guild was cached when this Yaritori started, `GuildMember`
   * will be returned, otherwise `APIInteractionGuildMember` represents
   * the raw API data returned from Discord
   * (only for slash commands; text commands always provide the full `GuildMember`).
   * TODO: Look into the caching of guilds.
   */
  public get member(): GuildMember | APIInteractionGuildMember | null {
    return this.interaction.member;
  }

  /**
   * The channel this Yaritori was started in.
   */
  public get channel(): TextBasedChannel | null {
    return this.interaction.channel;
  }

  /**
   * The ID of the channel this Yaritori was started in.
   */
  public get channelId(): Snowflake {
    return this.interaction.channelId;
  }

  /**
   * The client of this Yaritori.
   */
  public get client(): Client {
    return this.interaction.client;
  }

  /**
   * The time this Yaritori was started at.
   */
  public get createdAt(): Date {
    return this.interaction.createdAt;
  }

  /**
   * The timestamp this Yaritori was started at (in UNIX time).
   */
  public get createdTimestamp(): EpochTimeStamp {
    return this.interaction.createdTimestamp;
  }

  /**
   * The guild this Yaritori was started in, if it was started in one.
   */
  public get guild(): Guild | null {
    return this.interaction.guild;
  }

  /**
   * The ID of the guild this Yaritori was started in, if it was started in one.
   */
  public get guildId(): Snowflake | null {
    return this.interaction.guildId;
  }

  /**
   * The preferred locale of the user/guild that started this Yaritori.
   */
  public get preferredLocale(): Locale {
    /**
     * TODO: Check the user's preference once settings are implemented.
     */
    return this.if({
      slashCommand: (interaction) => interaction.locale,
      textCommand: (message) => message.guild?.preferredLocale ?? DEFAULT_LOCALE,
    });
  }

  /**
   * Replies to the user.
   */
  public reply(options: string | ReplyOptions) {
    return this.if({
      slashCommand: (interaction) => {
        if (interaction.replied) {
          return interaction.followUp(options);
        }

        if (interaction.deferred) {
          return interaction.editReply(options);
        }

        return interaction.reply(options);
      },
      textCommand: (message) => {
        if (typeof options === 'string') return message.reply(options);

        return message.reply({
          ...options,
          flags: MessageFlags.SuppressNotifications,
        });
      },
    });
  }

  /**
   * Defers the reply to this Yaritori.
   * Call as early as possible when it might take a long time (longer than 3 seconds) to respond to the user.
   * @see https://discordjs.guide/slash-commands/response-methods.html#deferred-responses
   * @warn only works for slash commands! will be a no-op when dealing with text commands.
   */
  public deferReply(options?: InteractionDeferReplyOptions) {
    return this.if({
      slashCommand: (interaction) => interaction.deferReply(options),
      textCommand: () => undefined,
    });
  }

  /**
   * Returns the value returned from `slashCommand`
   * if this yaritori was executed from a slash command,
   * otherwise returns the value returned from `textCommand`.
   */
  private if = <S, U>(values: {
    slashCommand: (interaction: ChatInputCommandInteraction) => S;
    textCommand: (message: Message) => U;
  }) => {
    if (this.interaction instanceof ChatInputCommandInteraction)
      return values.slashCommand(this.interaction);

    return values.textCommand(this.interaction);
  };
}

export default Yaritori;
