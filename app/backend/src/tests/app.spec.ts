import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';
import User from '../database/models/User'
import { Response } from 'superagent';
import { userMock } from './mock/models';
// import Users from './mock/models/Users.json'
import { Model } from 'sequelize/types';

chai.use(chaiHttp);

const { expect } = chai;

describe('Request POST method to route "/login"', async () => {

  let chaiHttpResponse: Response;
  const loginBody = {
    email: "admin@admin.com",
    password: "admin"
  }

  describe('when requested successfully', async () => {

    const loginReturn = {
      "id": 1,
      "username": "Admin",
      "role": "admin",
      "email": "admin@admin.com"  
    }

    before(async () => {
      sinon
        .stub(User, "findOne")
        .resolves(loginReturn as unknown as Model);
      
      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send(loginBody);  
    });

    after(()=>{
      (User.findOne as sinon.SinonStub).restore();
    })

    it('reponse body is an object ', async () => {
      
      expect(chaiHttpResponse.body).to.be.an('object');
    });

    it('response body has properties "user" and "token" ', async () => {

      expect(chaiHttpResponse.body).to.have.all.keys('user', 'token');
    });

    it('"user" has properties "id", "username", "role" and "email" ', async () => {

      expect(chaiHttpResponse.body.user).to.have.all.keys('id', 'username', 'role', 'email');
    });

    it('"token" is a string', async () => {

      expect(chaiHttpResponse.body.token).to.be.a('string');
    })
  })

  describe('when request fails', async () => {
    // let chaiHttpResponse: Response;

    before(async () => {
      sinon
        .stub(User, "findOne")
        .resolves(undefined);
      
      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send(loginBody);  
    });
      
    after(()=>{
      (User.findOne as sinon.SinonStub).restore();
    });

    it('return an object', async () => {

      expect(chaiHttpResponse.body).to.be.an('object');
    });

    it('the object contains a property message', async () => {

      expect(chaiHttpResponse.body).to.have.key('message');
    });

    it('the message is "Incorrect email or password"', async () => {

      expect(chaiHttpResponse.body.message).to.be.equal("Incorrect email or password");
    });

    it('the http code is 404', async () => {
      expect(chaiHttpResponse.status).to.be.equal(404)
    })
  });
});
