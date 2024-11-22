import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes';
import { setupSwagger } from './swagger';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);
setupSwagger(app);
export default app;
