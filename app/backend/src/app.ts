import * as express from 'express';
import * as cors from 'cors';
import { UserController } from './controllers/UserController';
import { generateToken } from './controllers/auth/generateToken';

class App {
  public app: express.Express;

  private _UserController = new UserController();

  constructor() {
    this.app = express();
    this.config();
    // this.routes();
  }

  private config(): void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(accessControl);
    this.app.use(express.json())
    this.app.use(cors())
  }

  private routes(): void {
    this.app.post('/login', this._UserController.login, generateToken);
  }

  // ...
  public start(PORT: string | number): void {
    this.app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
