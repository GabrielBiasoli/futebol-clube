import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';
import Club from '../database/models/Club'
import { Response } from 'superagent';
import { Model } from 'sequelize/types';
import clubs = require('./data/clubs.json');

chai.use(chaiHttp);
const { expect } = chai;
const fistClub = clubs[0];

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
      expect(chaiHttpResponse.body).to.be.an('array').of('object')
    })

    it('the objects contain "id" and "clubName" properties', async () => {
      expect(chaiHttpResponse.body[0]).to.have.all.keys('id', 'clubName');
    })
  })
})

describe('Request GET method to route "/clubs/:id" ', async () => {
  let chaiHttpResponse: Response;

  describe('when the club exist in database ', async () => {

    before(async () => {
      sinon
        .stub(Club, "findByPk")
        .resolves(fistClub as unknown as Model)
      chaiHttpResponse = await chai
        .request(app)
        .get('/clubs/1');
    })

    it('return an object ', async () => {
      expect(chaiHttpResponse.body).to.be.an('object');
    })

    it('the object contains properties "id" and "clubName"', async () => {
      expect(chaiHttpResponse.body).to.have.all.keys('id', 'clubName');
    })

    it('the property "id" is equal to 1', () => {
      expect(chaiHttpResponse.body.id).to.be.equal(1);
    })

    it('the property "clubName" is equal to "Grêmio"', () => {
      expect(chaiHttpResponse.body.clubName).to.be.equal("Grêmio");
    })

  })
})