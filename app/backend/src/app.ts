import * as express from 'express';
import * as cors from 'cors';
import * as UserController from './controllers/UserController';
import { generateToken } from './controllers/auth/generateToken';
import domainError from './controllers/middlewares/domainError';
import authenticateToken from './controllers/auth/authenticateToken';

class App {
  public app: express.Express;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  private config(): void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(accessControl);
    this.app.use(express.json());
    this.app.use(cors());
  }

  private routes(): void {
    this.app.post('/login', UserController.login, generateToken);
    this.app.get('/login/validate', authenticateToken, UserController.getRole);
    this.app.use(domainError);
  }

  // ...
  public start(PORT: string | number): void {
    this.app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
