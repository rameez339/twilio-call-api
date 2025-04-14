import pino from 'pino';
import pinoHttp from 'pino-http';

const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
});

const loggerHttp = pinoHttp({
  logger,
});

export { logger, loggerHttp };
