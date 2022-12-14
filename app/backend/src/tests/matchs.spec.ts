import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require("chai-http");

import { app } from '../app';
import Match from '../database/models/Match';
import { Response } from 'superagent';
import { Model } from 'sequelize/types';
import User from '../database/models/User';
const matchInProgress = require('./data/matchsInProgress.json');
const matchs = require('./data/matchsWithClubs.json');

chai.use(chaiHttp);

const { expect } = chai;

describe('Request GET method to route "/matchs" ', async () => {
  let chaiHttpResponse: Response

  describe('when matchs exist in database ', async () => {
  
    before(async () => {
      sinon
        .stub(Match, "findAll")
        .resolves(matchs as unknown as Model[]);
      
      chaiHttpResponse = await chai
        .request(app)
        .get('/matchs');
    });

    after(async () => {
      (Match.findAll as sinon.SinonStub).restore()
    });

    it('return an array', async () => {
      expect(chaiHttpResponse.body).to.be.an('array');
    })

    it('the array contains objects', async () => {
      expect(chaiHttpResponse.body[0]).to.be.an('object');
      expect(chaiHttpResponse.body[1]).to.be.an('object');
    });

    it('the object includes both "homeClub" and "awayClub" properties', async () => {
      expect(chaiHttpResponse.body[0]).to.include.keys("homeClub", "awayClub");
    });

    it('the object includes all "homeTeam", "homeTeamGoals", "awayTeam", "awayTeamGoals" and "inProgress" properties ',
      async () => {
        expect(chaiHttpResponse.body[0]).to.include
          .keys('homeTeam', 'homeTeamGoals', 'awayTeam', 'awayTeamGoals', 'inProgress');

      });
  });

  describe('when a query string is sent in the request ', async () => {
    before(async () => {
      sinon
        .stub(Match, "findAll")
        .resolves(matchInProgress as unknown as Model[]);
      
      chaiHttpResponse = await chai
        .request(app)
        .get('/matchs?inProgress=true');
    });

    after(async () => {
      (Match.findAll as sinon.SinonStub).restore()
    });

    it('return an array', async () => {
      expect(chaiHttpResponse.body).to.be.an('array');
    })

    it('the array contains objects', async () => {
      expect(chaiHttpResponse.body[0]).to.be.an('object');
      expect(chaiHttpResponse.body[1]).to.be.an('object');
    });

    it('the object include both "homeClub" and "awayClub" properties', async () => {
      expect(chaiHttpResponse.body[0]).to.include.keys('homeClub', 'awayClub');
    });

    it('the object include all "homeTeam", "homeTeamGoals", "awayTeam", "awayTeamGoals" and "inProgress" properties ',
      async () => {
        expect(chaiHttpResponse.body[0])
          .to
          .include
          .keys('homeTeam', 'homeTeamGoals', 'awayTeam', 'awayTeamGoals', 'inProgress');

      });

    it('the property "inProgress" is setted as true ', async () => {
      expect(chaiHttpResponse.body[0].inProgress).to.be.equal(true);
      expect(chaiHttpResponse.body[1].inProgress).to.be.equal(true);
    });
  });
});

describe('Request POST method to route "/matchs" ', async () => {
  let chaiHttpResponse: Response

  describe('when property "inProgress" is true ', async () => {
  
    const loginBody = {
      email: "admin@admin.com",
      password: "secret_admin"
    }

    const loginReturn = {
      "id": 1,
      "username": "Admin",
      "role": "admin",
      "email": "admin@admin.com",
      "password": "$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW"
    }

    const reqBody  = {
      "homeTeam": 1,
      "awayTeam": 2,
      "homeTeamGoals": 2,
      "awayTeamGoals": 0,
      "inProgress": true
    }

    const resBody = {
      id: 1,
      ...reqBody,
    }

    before(async () => {
      sinon
        .stub(Match, "create")
        .resolves([1] as unknown as Model);

      sinon
        .stub(Match, "findOne")
        .resolves(resBody as unknown as Model);
      
      sinon
        .stub(User, "findOne")
        .resolves(loginReturn as unknown as Model);

      const { body: { token } } = await chai
        .request(app)
        .post('/login')
        .send(loginBody);

      chaiHttpResponse = await chai
        .request(app)
        .post('/matchs')
        .send(reqBody)
        .set('authorization', token)
    });

    after(async () => {
      (Match.create as sinon.SinonStub).restore();
      (Match.findOne as sinon.SinonStub).restore();
      (User.findOne as sinon.SinonStub).restore();
    });

    it('return an object', async () => {
      expect(chaiHttpResponse.body).to.be.an('object');
    })

    it('the object includes the property "id', async () => {
      expect(chaiHttpResponse.body).to.includes.keys("id");
    });

    it('the object includes both "homeTeam" and "awayTeam" properties', async () => {
      expect(chaiHttpResponse.body).to.includes.keys('homeTeam', 'awayTeam');
    });

    it('the object includes all "homeTeamGoals", "awayTeamGoals" and "inProgress" properties ',
      async () => {
        expect(chaiHttpResponse.body)
          .to
          .includes
          .keys('homeTeamGoals', 'awayTeamGoals', 'inProgress');
      });
  });
});

describe('Request PATCH method to route "/matchs/:id/finish" ', async () => {
  let chaiHttpResponse: Response;

  describe('when property "inProgress" is false ', async () => {
  
    const reqBody  = {
      "id": 1,
      "homeTeam": 1,
      "awayTeam": 2,
      "homeTeamGoals": 2,
      "awayTeamGoals": 0,
      "inProgress": true
    }

    const resBody = {
      ...reqBody,
      inProgress: false,
    }

    const numberOfUpdates = 1;

    before(async () => {
      sinon
        .stub(Match, "findOne")
        .resolves(reqBody as unknown as Model);

      sinon
        .stub(Match, "update")
        .resolves([numberOfUpdates, [resBody] as unknown as Model[]]);

      chaiHttpResponse = await chai
        .request(app)
        .patch('/matchs');
    });

    after(async () => {
      (Match.update as sinon.SinonStub).restore();
      (Match.findOne as sinon.SinonStub).restore();
    });

    it('returns a empty object ', async () => {
      expect(chaiHttpResponse.body).to.be.an('object');
    });
  });
});