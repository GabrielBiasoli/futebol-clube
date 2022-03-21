import { App } from './app';
import 'dotenv/config';

const PORT = process.env.PORT || 3001;

const server = new App();

server.start(PORT);
