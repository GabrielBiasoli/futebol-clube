import * as express from 'express';
import * as cors from 'cors';
import * as UserController from './controllers/UserController';
import * as ClubController from './controllers/ClubController';
import * as MatchController from './controllers/MatchController';
import * as LeaderboardController from './controllers/LeaderboardController';
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
    this.app.patch('/matchs/:id/finish', MatchController.finishMatch, MatchController.getAll);
    this.app.patch('/matchs/:id', MatchController.updateGoals);
    this.app.get('/matchs', MatchController.getAll, MatchController.getAllInProgress);
    this.app.post('/matchs', authenticateToken, MatchController.create);
    this.app.post('/login', UserController.login, generateToken);
    this.app.get('/login/validate', authenticateToken, UserController.getRole);
    this.app.get('/clubs', ClubController.getAll);
    this.app.get('/clubs/:id', ClubController.getById);
    this.app.get('/leaderboard/home', LeaderboardController.getAllByHome);
    this.app.get('/leaderboard/away', LeaderboardController.getAllByAway);
    this.app.get('/leaderboard', LeaderboardController.getAll);
    this.app.use(domainError);
  }

  // ...
  public start(PORT: string | number): void {
    this.app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  }
}

export { App };

// A execu????o dos testes de cobertura depende dessa exporta????o
export const { app } = new App();
