import { transports } from 'winston';
import appRoot from 'app-root-path';

interface Options {
  file: transports.FileTransportOptions,
  console: transports.ConsoleTransportOptions
}

const options: Options = {
  file: {
    level: 'info',
    filename: `${appRoot}/app/logs/app.log`,
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5
  },
  console: {
    level: 'debug',
    handleExceptions: true
  } 
};

export default options;