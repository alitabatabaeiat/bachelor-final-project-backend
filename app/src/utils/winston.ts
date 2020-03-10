import winston, {Logger, format} from 'winston';
import {winstonConfig as config} from '@configs';

type CustomLogger = Logger & { mStream?: object };

const logger: CustomLogger = winston.createLogger({
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.json()
    ),
    transports: [
        new winston.transports.File(config.file),
        new winston.transports.Console(config.console)
    ],
    exitOnError: false // do not exit on handled exceptions
});

logger.mStream = {
    write: (message, encoding) => logger.info(message)
};

export default logger;
