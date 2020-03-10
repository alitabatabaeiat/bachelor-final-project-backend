import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
    type: 'sqlite',
    database: process.env.DB,
    entities: [
        __dirname + '/../**/*.entity{.ts,.js}'
    ],
    logging: true,
    synchronize: true
};

export default config;
