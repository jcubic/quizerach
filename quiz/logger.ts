import { createLogger, transports } from 'winston';

const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'debug.log' })
  ]
});

export default logger;
