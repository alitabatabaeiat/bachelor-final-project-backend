import dotenv from 'dotenv';
dotenv.config({ path: 'app/src/.env'});
import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { createConnection } from 'typeorm';
import routes from './routes';
import { ormConfig } from '@configs';
import { winston } from '@utils';
import { errorMiddleware, notFoundMiddleware } from '@middleware';

const app = express();
app.use(morgan('combined', {stream: winston.mStream}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api/v1', routes);

app.use(notFoundMiddleware());
app.use(errorMiddleware());

const port = process.env.PORT || 5000;
const start = async () => {
    try {
        await createConnection(ormConfig);
        app.listen(port, () => winston.info('App started successfully'));
    } catch (error) {
        winston.error('Error while connecting to the database', error);
        return error;
    }
};

export default {
    start
};
