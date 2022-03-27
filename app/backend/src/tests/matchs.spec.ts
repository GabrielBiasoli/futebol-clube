import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';
import Match from '../database/models/Match'
import { Response } from 'superagent';
import { Model } from 'sequelize/types';
import matchs = require('./data/clubs.json')

chai.use(chaiHttp);

const { expect } = chai;

describe('Request GET method to route "/matchs" ', async () => {
  let chaiHttpResponse: Response

  describe('when matchs exist in database ', async () => {
  
    before(async () => {
      sinon
        .stub(Match, "findAll")
        .resolves();
      
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
});