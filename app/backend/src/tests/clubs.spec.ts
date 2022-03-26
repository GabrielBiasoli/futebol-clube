import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';
import Club from '../database/models/Club'
import { Response } from 'superagent';
import { Model } from 'sequelize/types';
import clubs = require('./data/clubs.json')

chai.use(chaiHttp);
const { expect } = chai;

describe('Request GET method to route "/clubs" ', async () => {
  let chaiHttpResponse: Response;

  describe('when clubs exist in database ', async () => {

    before(async () => {
      sinon
        .stub(Club, "findAll")
        .resolves(clubs as unknown as Model[])
      chaiHttpResponse = await chai
        .request(app)
        .get('/clubs');
    })

    it('return an array ', async () => {
      expect(chaiHttpResponse.body).to.be.an('array');
    })

    it('the array contains objects', async () => {
      expect(chaiHttpResponse.body).to.be.an('array').of('objects')
    })

    it('the objects contain "id" and "clubname" properties', async () => {
      expect(chaiHttpResponse.body[0]).to.have.all.keys('id', 'clubname');
    })
  })
})
