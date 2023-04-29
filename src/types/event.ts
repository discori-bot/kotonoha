type BotEvent = {
  execute: (...args: unknown[]) => void;
  name: string;
  once?: boolean;
};

export default BotEvent;
