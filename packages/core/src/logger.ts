import { createLogger, format, transports } from 'winston';

// winston.emitErrs = true;

export const logger = createLogger({
    format: format.simple() ,
    transports: [
        new transports.Console({
            level: 'debug',
            handleExceptions: true,
            // json: false,
            // colorize: true
        }),
        // new transports.Console({level: 'debug'}) ,
        new transports.File({ filename: 'error.log', level: 'error' }),
    ],
    // exitOnError: false,
}) ;

logger.info('logger start ....') ;