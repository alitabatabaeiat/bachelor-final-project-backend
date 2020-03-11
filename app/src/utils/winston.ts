import winston, {Logger, format} from 'winston';
import {winstonConfig as config} from '@configs';

type CustomLogger = Logger & { mStream?: object };

const fileTransportInstance = new winston.transports.File(config.file);
const consoleTransportInstance = new winston.transports.Console(config.console);

fileTransportInstance.format = format.combine(
    format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.json(),
);
consoleTransportInstance.format = format.combine(
    format.json(),
    format.prettyPrint({colorize: true})
);
const logger: CustomLogger = winston.createLogger({
    transports: [
        fileTransportInstance,
        consoleTransportInstance
    ],
    exitOnError: false // do not exit on handled exceptions
});

logger.mStream = {
    write: (message, encoding) => logger.info(message)
};

export default logger;
