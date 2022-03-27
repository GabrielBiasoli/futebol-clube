import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';
import Match from '../database/models/Match'
import { Response } from 'superagent';
import { Model } from 'sequelize/types';
import matchs = require('./data/matchsWithClubs.json')
import matchInProgress = require('./data/matchsInProgress.json')
import User from '../database/models/User';

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

    it('the object contains both "homeClub" and "awayClub" properties', async () => {
      expect(chaiHttpResponse.body[0]).to.have.keys('homeClub', 'awayClub');
    });

    it('the object contains all "homeTeam", "homeTeamGoals", "awayTeam", "awayTeamGoals" and "inProgress" properties ',
      async () => {
        expect(chaiHttpResponse.body[0])
          .to
          .have
          .keys('homeTeam', 'homeTeamGoals', 'awayTeam', 'awayTeamGoals', 'inProgress');

      });

    it('the object response is the expected one ', async () => {
      expect(chaiHttpResponse.body).to.be.equal(matchs);
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

    it('the object contains both "homeClub" and "awayClub" properties', async () => {
      expect(chaiHttpResponse.body[0]).to.have.keys('homeClub', 'awayClub');
    });

    it('the object contains all "homeTeam", "homeTeamGoals", "awayTeam", "awayTeamGoals" and "inProgress" properties ',
      async () => {
        expect(chaiHttpResponse.body[0])
          .to
          .have
          .keys('homeTeam', 'homeTeamGoals', 'awayTeam', 'awayTeamGoals', 'inProgress');

      });

    it('the property "inProgress" is setted as true ', async () => {
      expect(chaiHttpResponse.body[0].inProgress).to.be.equal(true);
      expect(chaiHttpResponse.body[1].inProgress).to.be.equal(true);
    })

    it('the object response is the expected one ', async () => {
      expect(chaiHttpResponse.body[0]).to.be.equal(matchInProgress[0]);
    });

  })
});

describe('Request POST method to route "/matchs" ', async () => {
  let chaiHttpResponse: Response

  describe('when property "inProgress" is true ', async () => {
  
    const loginBody = {
      email: "admin@admin.com",
      password: "admin"
    }

    const loginReturn = {
      "id": 1,
      "username": "Admin",
      "role": "admin",
      "email": "admin@admin.com"  
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
        .set("X-API-Key", token);
    });

    after(async () => {
      (Match.create as sinon.SinonStub).restore()
    });

    it('return an object', async () => {
      expect(chaiHttpResponse.body).to.be.an('object');
    })

    it('the object contains the property "id', async () => {
      expect(chaiHttpResponse.body).to.have.key("id");
    });

    it('the object contains both "homeTeam" and "awayTeam" properties', async () => {
      expect(chaiHttpResponse.body).to.have.keys('homeTeam', 'awayTeam');
    });

    it('the object contains all "homeTeamGoals", "awayTeamGoals" and "inProgress" properties ',
      async () => {
        expect(chaiHttpResponse.body)
          .to
          .have
          .keys('homeTeamGoals', 'awayTeamGoals', 'inProgress');

      });

    it('the object response is the expected one ', async () => {
      expect(chaiHttpResponse.body).to.be.equal(resBody);
    });
  });
});