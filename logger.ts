import pino, { LoggerOptions } from 'pino';

const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true, translateTime: 'HH:MM:ss Z' },
  },
} as LoggerOptions);

export default logger;
