import { createLogger, format, transports } from 'winston';

const {
  combine,
  timestamp,
  printf,
  prettyPrint,
  colorize,
  align,
} = format;

// Utils
import { NODE_ENV } from './config';

const myformat = combine(
    colorize(),
    timestamp(),
    align(),
    prettyPrint(),
    printf((info) => {
        let message = `${info.timestamp} ${info.level}: ${info.message}`;
        if (info.stack) message += `\nTraceback: ${info.stack}`;
        return message;
    })
);

const logger = createLogger({
    exitOnError: false,
    transports: [
        new transports.Console({
            level: NODE_ENV === 'production' ? 'info' : 'debug',
            handleExceptions: true,
            format: myformat,
        })
    ]
});

export default logger;