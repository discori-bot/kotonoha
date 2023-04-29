type BotEvent = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: (...args: any[]) => Promise<void>;
  name: string;
  once?: boolean;
};

export default BotEvent;
